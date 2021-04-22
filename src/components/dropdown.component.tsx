import { ReactNode, useState } from "react";
import { generateStrongPassword } from "../utils";

interface IDropdown {
  trigger: ReactNode;
  items?: ReactNode[];
  isHidden?: boolean;
}

export const Dropdown = (props: IDropdown) => {
  const [hidden, setHidden] = useState(props?.isHidden ?? true);
  const toggleHidden = () => setHidden(!hidden);

  return (
    <ul className={`dropdown ${hidden && "dropdown__hidden"}`}>
      <li className="dropdown__trigger" onClick={toggleHidden}>
        {props.trigger}
      </li>
      <div className="dropdown__items">
        {props.items &&
          props.items.map((item, index) => {
            return (
              <li
                className="dropdown__item"
                key={`dropdown__item__${generateStrongPassword()}__${index}`}
              >
                {item}
              </li>
            );
          })}
      </div>
    </ul>
  );
};
