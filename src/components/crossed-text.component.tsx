import { PropsWithChildren } from "react";

interface CrossedTextProps {
  className?: string;
}

export const CrossedText = (props: PropsWithChildren<CrossedTextProps>) => {
  return (
    <div className={`crossed-text ${props?.className}`}>
      <span className="crossed-text__line"></span>
      {props?.children}
      <span className="crossed-text__line"></span>
    </div>
  );
};
