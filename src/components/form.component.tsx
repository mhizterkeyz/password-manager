import { FormEventHandler, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface FormProps {
  className?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  errorMessage?: string;
}

export const Form = (props: PropsWithChildren<FormProps>) => {
  return (
    <form
      action="#"
      onSubmit={props?.onSubmit}
      className={`form ${props?.className}`}
    >
      {props?.children}
    </form>
  );
};

export const FormTitle = (props: { text: string }) => {
  return <h3 className="form__title">{props.text}</h3>;
};

export const FormErrorText = (props: { text: string }) => {
  return <p className="form__error-text">{props.text}</p>;
};

export const FormLink = (props: { text: string; to: string }) => {
  return (
    <Link className="form__link" to={props.to}>
      {props.text}
    </Link>
  );
};

export const FormText = (props: PropsWithChildren<unknown>) => {
  return <p className="form__text">{props?.children}</p>;
};
