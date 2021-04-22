import { MouseEventHandler, PropsWithChildren } from "react";

interface ITooltip {
  text: string;
  disable?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseOut?: MouseEventHandler<HTMLDivElement>;
}

export const Tooltip = (props: PropsWithChildren<ITooltip>) => {
  return (
    <div
      className="tooltip"
      onClick={props?.onClick}
      onMouseOut={props?.onMouseOut}
    >
      {!props?.disable && <p className="tooltip__text">{props.text}</p>}
      {props?.children}
    </div>
  );
};
