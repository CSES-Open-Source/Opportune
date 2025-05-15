import {
  FiHome,
  FiBriefcase,
  FiLink,
  FiCheckSquare,
  FiBookmark,
  FiCode,
  FiFileText,
  FiTerminal,
} from "react-icons/fi";
import { NavItem } from "../types/NavItem";

export const navItems: NavItem[] = [
  {
    label: "Home",
    path: "/",
    icon: FiHome,
  },
  {
    label: "Companies",
    path: "/companies",
    icon: FiBriefcase,
  },
  {
    label: "Connect",
    path: "/connect",
    icon: FiLink,
  },
  {
    label: "Applications",
    path: "/applications/applied",
    icon: FiCheckSquare,
  },
  {
    label: "Saved Jobs",
    path: "/applications/saved",
    icon: FiBookmark,
  },
  {
    label: "Interview",
    path: "/interview/behavioral",
    icon: FiFileText,
    disabled: true,
  },
  {
    label: "Leetcode",
    path: "/interview/leetcode",
    icon: FiTerminal,
    disabled: true,
  },
  {
    label: "Sandbox",
    path: "/sandbox",
    icon: FiCode,
    disabled: false,
  },
];
