import { useState, ChangeEvent, FormEvent } from "react";
import { RouteComponentProps } from "react-router";

import {
  Form,
  FormErrorText,
  FormLink,
  FormText,
  FormTitle,
} from "./form.component";
import { IconInput } from "./icon-input.component";
import google from "../assets/google.svg";
import { Button } from "./button.component";
import { useAppContext } from "../context/AppContext";
import { $api } from "../utils/api";
import { validateLogin, validateSignup } from "../utils/validator";
import { handleLocalInputs } from "../utils";

export const LoginForm = (props: RouteComponentProps) => {
  const { user, updateUser } = useAppContext();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleInputs = (event: ChangeEvent<HTMLInputElement>) => {
    handleLocalInputs(event, setInputs, inputs);
    setLoginError("");
  };
  const loginUser = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const loginValidation = validateLogin(inputs);
      if (loginValidation.hasErrors) {
        setErrors(loginValidation.errors);
        return;
      }

      const loginAttempt = await $api.users.login(inputs);
      $api.setAuthHeader(loginAttempt?.token as string);
      props.history.push("/");
      updateUser({ ...loginAttempt, isLoggedIn: true });
    } catch (error) {
      setLoginError(error.message);
    }
  };

  if (user.isLoggedIn) {
    props.history.push("/");
  }

  return (
    <Form className="form__auth-form" onSubmit={loginUser}>
      <FormTitle text="Welcome! Please login" />
      <FormErrorText text={loginError} />
      <IconInput
        icon={google}
        className="form__auth-form__input"
        placeholder="Email/Username"
        value={inputs.username}
        onChange={handleInputs}
        name="username"
        errorText={errors.username}
      />
      <IconInput
        type="password"
        className="form__auth-form__input"
        icon={google}
        placeholder="Password"
        value={inputs.password}
        onChange={handleInputs}
        name="password"
        errorText={errors.password}
      />

      <div className="form__auth-form__links-container">
        <FormLink to="/signup" text="Sign up" />
        <FormLink to="/forgot" text="Forgot password?" />
      </div>

      <Button type="primary" className="form__auth-form__button" text="Login" />
    </Form>
  );
};

export const SignupForm = (props: RouteComponentProps) => {
  const { user, updateUser } = useAppContext();
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [signupError, setSignupError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });
  const signupUser = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const signupValidation = validateSignup(inputs);
      if (signupValidation.hasErrors) {
        setErrors(signupValidation.errors);
        return;
      }

      const signupAttempt = await $api.users.signup(inputs);
      $api.setAuthHeader(signupAttempt?.token as string);
      updateUser({ ...signupAttempt, isLoggedIn: true });
      props.history.push("/");
    } catch (error) {
      setSignupError(error.message);
    }
  };
  const handleInputs = (event: ChangeEvent<HTMLInputElement>) => {
    setSignupError("");
    handleLocalInputs(event, setInputs, inputs);
  };

  if (user.isLoggedIn) {
    props.history.push("/");
  }

  return (
    <Form className="form__auth-form" onSubmit={signupUser}>
      <FormTitle text="Welcome! Please signup" />

      <FormErrorText text={signupError} />
      <IconInput
        icon={google}
        className="form__auth-form__input"
        placeholder="Email"
        type="email"
        name="email"
        value={inputs.email}
        onChange={handleInputs}
        errorText={errors.email}
      />
      <IconInput
        icon={google}
        className="form__auth-form__input"
        placeholder="Username"
        name="username"
        value={inputs.username}
        onChange={handleInputs}
        errorText={errors.username}
      />
      <IconInput
        type="password"
        className="form__auth-form__input"
        icon={google}
        placeholder="Password"
        name="password"
        value={inputs.password}
        onChange={handleInputs}
        errorText={errors.password}
      />

      <div className="form__auth-form__links-container">
        <FormText>
          Already have an account? <FormLink to="/login" text="Sign in" />
        </FormText>
      </div>

      <Button
        type="primary"
        className="form__auth-form__button"
        text="Sign up"
      />
    </Form>
  );
};
