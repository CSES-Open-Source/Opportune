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
    url: "/",
    icon: FiHome,
  },
  {
    label: "Companies",
    url: "/companies",
    icon: FiBriefcase,
  },
  {
    label: "Connect",
    url: "/connect",
    icon: FiLink,
  },
  {
    label: "Applications",
    url: "/applications/applied",
    icon: FiCheckSquare,
  },
  {
    label: "Saved Jobs",
    url: "/applications/saved",
    icon: FiBookmark,
  },
  {
    label: "Interview",
    url: "/interview/behavioral",
    icon: FiFileText,
  },
  {
    label: "Leetcode",
    url: "/interview/leetcode",
    icon: FiTerminal,
  },
  {
    label: "Sandbox",
    url: "/sandbox",
    icon: FiCode,
    disabled: false,
  },
];
