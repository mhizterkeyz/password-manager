import { ChangeEventHandler, MouseEventHandler } from "react";

interface IconInputProps {
  icon: string;
  placeholder?: string;
  type?: string;
  className?: string;
  readonly?: boolean;
  value?: string;
  iconInputType?: IconInputType;
  onIconClick?: MouseEventHandler<HTMLImageElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  errorText?: string;
}

type IconInputType = "align-right";

export const IconInput = (props: IconInputProps) => {
  return (
    <div
      className={`icon-input ${props?.className} icon-input__icon-${props?.iconInputType}`}
    >
      <img
        src={props.icon}
        alt="prepend_icon"
        className="icon-input__icon"
        onClick={props?.onIconClick}
      />
      <input
        type={props?.type ?? "text"}
        placeholder={props?.placeholder}
        className={`icon-input__input ${
          props?.readonly && "icon-input__disabled"
        }`}
        readOnly={props?.readonly}
        value={props?.value}
        onClick={props?.onClick}
        onChange={props?.onChange}
        name={props?.name}
      />
      {!!props?.errorText && (
        <p className="icon-input__error-text">{props?.errorText}</p>
      )}
    </div>
  );
};
