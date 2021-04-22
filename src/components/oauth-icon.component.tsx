import google from "../assets/google.svg";
import twitter from "../assets/twitter.svg";
import facebook from "../assets/facebook.svg";

interface OAuthIconProps {
  className?: string;
}

interface BaseOAuthIconProps extends OAuthIconProps {
  icon: string;
  text: string;
}

const BaseOAuthIcon = (props: BaseOAuthIconProps) => {
  return (
    <div className={`oauth-icon ${props?.className}`}>
      <img
        src={props.icon}
        alt={`${props.text}_icon`}
        className="oauth-icon__icon"
      />
      <span className="oauth-icon__text">{props.text}</span>
    </div>
  );
};

const Google = (props: OAuthIconProps) => {
  return (
    <BaseOAuthIcon className={props?.className} icon={google} text="Google" />
  );
};

const Twitter = (props: OAuthIconProps) => {
  return (
    <BaseOAuthIcon className={props?.className} icon={twitter} text="Twitter" />
  );
};

const Facebook = (props: OAuthIconProps) => {
  return (
    <BaseOAuthIcon
      className={props?.className}
      icon={facebook}
      text="Facebook"
    />
  );
};

export const OAuthIcons = {
  Google,
  Twitter,
  Facebook,
};
