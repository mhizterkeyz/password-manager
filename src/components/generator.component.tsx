import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import { Button } from "./button.component";
import { IconInput } from "./icon-input.component";
import google from "../assets/google.svg";
import { generateStrongPassword, handleLocalInputs } from "../utils";
import { CopyInputText } from "./copytext.component";
import { useAppContext } from "../context/AppContext";
import { $api } from "../utils/api";
import { validatePassword } from "../utils/validator";

export const Generator = () => {
  const [errors, setErrors] = useState<{ username?: string; domain: string }>({
    domain: "",
    username: "",
  });
  const {
    user,
    passwords,
    generator,
    updateGenerator,
    updatePasswords,
    logoutUser,
  } = useAppContext();
  const generate = () => {
    const password = generateStrongPassword();
    updateGenerator({ ...generator, password });
  };
  const handleInputs = (event: ChangeEvent<HTMLInputElement>) => {
    handleLocalInputs(event, updateGenerator, generator);
  };
  const insertPassword = (password: any) => {
    const p = [password, ...passwords];
    updatePasswords(
      p.sort((a, b) => {
        return moment(a.createdAt).isAfter(moment(b.createdAt)) ? -1 : 1;
      })
    );
  };
  const clearGenerator = () =>
    updateGenerator({ id: "", username: "", domain: "", password: "" });
  const savePassword = async () => {
    try {
      const passwordValidation = validatePassword(generator);
      if (passwordValidation.hasErrors) {
        setErrors(passwordValidation.errors);
        return;
      }
      const data = await $api.passwords.createPassword(generator);
      insertPassword(data);
      clearGenerator();
    } catch (error) {
      if (error.status === 401) {
        logoutUser();
        return;
      }

      toast.error(`Error saving password - ${error.message}`);
    }
  };
  const updatePassword = async () => {
    try {
      const passwordValidation = validatePassword(generator);
      if (passwordValidation.hasErrors) {
        setErrors(passwordValidation.errors);
        return;
      }

      const pwd = await $api.passwords.updatePassword(generator);
      console.log("PWD is ", pwd);
      updatePasswords(
        passwords.map((p) => {
          if (p.id === pwd.id) {
            return pwd;
          }
          return p;
        })
      );
      clearGenerator();
    } catch (error) {
      if (error.status === 401) {
        logoutUser();
        return;
      }

      toast.error(`Error updating password - ${error.message}`);
    }
  };
  const canSave = !!generator.password && user.isLoggedIn;

  return (
    <div
      className={`generator ${
        (!user.isLoggedIn || !passwords.length) &&
        "generator__non-authenticated"
      }`}
    >
      <h1 className="heading__1 generator__title">
        Generate a strong password
      </h1>
      {canSave && (
        <div className="generator__identity-inputs">
          <IconInput
            icon={google}
            className="generator__identity-inputs__input"
            placeholder="Domain"
            name="domain"
            value={generator.domain}
            errorText={errors.domain}
            onChange={handleInputs}
          />
          <IconInput
            icon={google}
            className="generator__identity-inputs__input"
            placeholder="Username"
            name="username"
            value={generator.username}
            errorText={errors.username}
            onChange={handleInputs}
          />
        </div>
      )}
      <CopyInputText text={generator.password}>
        <IconInput
          icon={google}
          className="generator__input"
          readonly={true}
          placeholder="Password"
          value={generator.password}
        />
      </CopyInputText>
      <Button
        onclick={generate}
        text="Generate"
        type="primary"
        className="generator__action-button"
      />
      {canSave && (
        <Button
          text="Save"
          type="secondary"
          onclick={generator.id ? updatePassword : savePassword}
          className="generator__action-button"
        />
      )}
    </div>
  );
};
