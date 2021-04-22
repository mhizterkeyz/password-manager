import { PropsWithChildren, useState } from "react";
import { copyToClipboard } from "../utils";
import { Tooltip } from "./tooltip.component";

interface ICopyInputText {
  text: string;
}

export const CopyInputText = (props: PropsWithChildren<ICopyInputText>) => {
  const [tooltipText, setTooltipText] = useState("Click to copy");
  const handleTooltipClick = () => {
    if (!props.text) return;
    copyToClipboard(props.text);
    setTooltipText("Copied!");
  };
  const handleTooltipMouseOut = () => {
    setTooltipText("Click to copy");
  };

  return (
    <Tooltip
      text={tooltipText}
      disable={!props.text.length}
      onClick={handleTooltipClick}
      onMouseOut={handleTooltipMouseOut}
    >
      {props?.children}
    </Tooltip>
  );
};
