import { Status } from "../types/Application";

// TODO: Set proper colors
export const statusColors: Record<string, string> = {
  [Status.Applied]: "bg-green-200 text-green-800",
  [Status.OA]: "bg-yellow-200 text-yellow-800",
  [Status.Phone]: "bg-yellow-200 text-yellow-800",
  [Status.Final]: "bg-yellow-200 text-yellow-800",
  [Status.Offer]: "bg-blue-200 text-blue-800",
  [Status.Rejected]: "bg-red-200 text-red-800",
};
