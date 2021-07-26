import React from "react";

import { BaseButton } from "./styled";

export interface IButton {
  children: React.ReactNode;
}

export const Button: React.FC<IButton> = ({ ...rest }) => {
  return <BaseButton {...rest} />;
};
