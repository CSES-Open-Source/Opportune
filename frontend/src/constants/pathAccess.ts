import { UserType } from "../types/User";

export const requireLogin: string[] = [
  "/applications/applied",
  "/applications/applied/:id",
  "/applications/saved",
  "/applications/saved/:id",
  "/profile",
];

export const roleGuard: { path: string; role: UserType[] }[] = [
  // { path: "/companies", role: [UserType.Student] }, // e.g. do not let students access company page.
];
