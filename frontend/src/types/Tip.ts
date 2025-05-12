import { Company } from "./Company";
import { User } from "./User";

export interface Tip {
  _id: string;
  company: Company;
  user: User;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTipRequest {
  company: Company;
  user: string;
  text: string;
}

export interface UpdateTipRequest {
  company?: Company;
  text?: string;
}
