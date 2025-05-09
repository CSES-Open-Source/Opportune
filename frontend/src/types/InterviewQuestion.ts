import { Company } from "./Company";

export interface InterviewQuestion {
  company: Company;
  question: string;
  date: Date;
}

export interface CreateInterviewQuestionRequest {
  company: Company;
  question: string;
  date: Date;
}

export interface UpdateInterviewQuestionRequest {
  company?: Company;
  question?: string;
  date?: Date;
}

export interface GetInterviewQuestionsQuery {
  page?: number;
  perPage?: number;
  query?: string;
  sortBy?: string;
}
