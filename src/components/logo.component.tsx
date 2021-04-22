import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export const Logo = () => {
  return (
    <Link to="/">
      {" "}
      <img src={logo} alt="logo_svg" className="logo" />
    </Link>
  );
};
