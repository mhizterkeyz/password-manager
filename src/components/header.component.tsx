import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Button } from "./button.component";

import { Dropdown } from "./dropdown.component";
import { Logo } from "./logo.component";
import { ProfileImage } from "./profile-image.component";

export const Header = () => {
  const { pathname } = window.location;
  const notInLoginOrSigninPages =
    !pathname.includes("/login") && !pathname.includes("/signup");
  const { user, logoutUser } = useAppContext();

  return (
    <div className="header">
      <Logo />

      {user.isLoggedIn && (
        <Dropdown
          trigger={
            <>
              <ProfileImage /> {user.username}
            </>
          }
          items={[
            <span className="dropdown__item__inner" onClick={logoutUser}>
              Log out
            </span>,
          ]}
        />
      )}
      {notInLoginOrSigninPages && !user.isLoggedIn && (
        <Link to="/login">
          <Button text="Login" type="secondary" />
        </Link>
      )}
    </div>
  );
};
