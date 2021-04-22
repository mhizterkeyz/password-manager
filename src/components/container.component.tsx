import { PropsWithChildren } from "react";

interface ContainerProps {}

export const Container = (props: PropsWithChildren<ContainerProps>) => {
  return <div className="container">{props?.children}</div>;
};
