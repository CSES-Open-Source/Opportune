import { Status } from "../types/Application";

// TODO: Set proper colors
export const statusColors: Record<string, string> = {
  [Status.Applied]: "bg-blue-500 text-blue-800",
  [Status.OA]: "bg-yellow-500 text-yellow-800",
  [Status.Phone]: "bg-purple-500 text-purple-800",
  [Status.Final]: "bg-indigo-500 text-indigo-800",
  [Status.Offer]: "bg-green-500 text-green-800",
  [Status.Rejected]: "bg-red-500 text-red-800",
};
