import { Company } from "./Company";

export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

export interface LeetcodeQuestion {
  company: Company;
  title: string;
  url: string;
  difficulty: Difficulty;
  date?: Date;
}

export interface CreateLeetcodeQuestionRequest {
  company: Company;
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

export interface GetLeetcodeQuestionsByCompanyIDQuery {
  page?: number;
  perPage?: number;
}