import { Company } from "./Company";
import { User } from "./User";

export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export interface LeetcodeQuestion {
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
