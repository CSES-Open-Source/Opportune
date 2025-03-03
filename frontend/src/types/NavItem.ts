import { IconType } from "react-icons";

export interface NavItem {
  label: string;
  path: string;
  icon?: IconType;
  disabled?: boolean;
}
