import { Company } from "./Company";
import { User } from "./User";

export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export interface LeetcodeQuestionJSON {
  _id: string;
  company: Company;
  user: User;
  title: string;
  url: string;
  difficulty: Difficulty;
  date?: string;
}

export interface LeetcodeQuestion {
  _id: string;
  company: Company;
  user: User;
  title: string;
  url: string;
  difficulty: Difficulty;
  date?: Date;
}

export interface CreateLeetcodeQuestionRequest {
  company: Company;
  user: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  date?: Date;
}

export interface UpdateLeetcodeQuestionRequest {
  company?: Company;
  user?: User;
  title?: string;
  url?: string;
  difficulty?: Difficulty;
  date?: Date;
}

export interface GetLeetcodeQuestionsQuery {
  page?: number;
  perPage?: number;
  query?: string;
  sortBy?: string;
  difficulty?: Difficulty;
}
