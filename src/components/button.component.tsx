import { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  className?: string;
  type?: ButtonType;
  onclick?: MouseEventHandler<HTMLButtonElement>;
}

type ButtonType = "primary" | "secondary" | "danger";

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props?.onclick}
      className={`button button__${props?.type} ${props?.className}`}
    >
      {props?.text}
    </button>
  );
};
