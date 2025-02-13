import { IconType } from "react-icons";

export interface NavItem {
  label: string;
  url: string;
  icon?: IconType;
  disabled?: boolean;
}
