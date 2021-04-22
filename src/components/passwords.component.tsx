import { toast } from "react-toastify";

import shield from "../assets/shield.svg";
import hidden from "../assets/hidden.svg";
import visible from "../assets/visible.svg";
import { Button } from "../components/button.component";
import { IconInput } from "../components/icon-input.component";
import { useEffect, useState } from "react";
import { CopyInputText } from "./copytext.component";
import { IPasswordItem, useAppContext } from "../context/AppContext";
import { $api } from "../utils/api";

const PasswordItem = (props: IPasswordItem) => {
  const [reveal, setReveal] = useState(false);
  const toggleReveal = () => setReveal(!reveal);
  const {
    updateGenerator,
    updatePasswords,
    passwords,
    logoutUser,
  } = useAppContext();

  const deletePassword = async () => {
    try {
      const pwd = await $api.passwords.deletePassword(props);
      updatePasswords(
        passwords.filter((p) => {
          return p.id !== pwd.id;
        })
      );
    } catch (error) {
      if (error.status === 401) {
        logoutUser();
        return;
      }

      toast.error(`Error updating password - ${error.message}`);
    }
  };

  return (
    <div className="passwords__item">
      <img
        src={props?.image ?? shield}
        alt="shield_svg"
        className="passwords__item__image"
      />
      <div className="passwords__item__content">
        <p className="passwords__item__content__domain">{props.domain}</p>
        <p className="passwords__item__content__username">{props?.username}</p>
        <CopyInputText text={props.password}>
          <IconInput
            icon={reveal ? visible : hidden}
            type={reveal ? "text" : "password"}
            value={props.password}
            iconInputType="align-right"
            readonly={true}
            onIconClick={toggleReveal}
          />
        </CopyInputText>
      </div>
      <div className="passwords__item__action">
        <Button
          text="Edit"
          type="secondary"
          onclick={() => updateGenerator(props)}
          className="passwords__item__action__item"
        />
        <Button
          text="Delete"
          type="danger"
          onclick={deletePassword}
          className="passwords__item__action__item"
        />
      </div>
    </div>
  );
};

export const Passwords = () => {
  const { user, passwords, updatePasswords, logoutUser } = useAppContext();
  useEffect(() => {
    if (user.isLoggedIn && !passwords.length)
      (async () => {
        try {
          const passwords = await $api.passwords.getPasswords();
          updatePasswords(passwords);
        } catch (error) {
          if (error.status === 401) {
            logoutUser();
            updatePasswords([]);
            return;
          }
          toast.error(`Error retrieving passwords - ${error.message}`);
        }
      })();
  }, [logoutUser, passwords.length, updatePasswords, user.isLoggedIn]);

  return (
    <div className="passwords">
      {passwords.map((item) => {
        return <PasswordItem {...item} key={item.id} />;
      })}
    </div>
  );
};
