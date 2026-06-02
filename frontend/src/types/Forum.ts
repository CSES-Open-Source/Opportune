export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Answer {
  _id: string;
  userId: string;
  answerContent: string;
  reactions: Reaction[];
  replies: Answer[];
  createdDate: string;
  modifiedDate: string;
}

export interface Question {
  _id: string;
  questionTitle: string;
  questionContent: string;
  userId: string;
  answers: Answer[];
  createdDate: string;
  modifiedDate: string;
}

export interface CreateQuestionRequest {
  questionTitle: string;
  questionContent: string;
  userId: string;
}

export interface UpdateQuestionRequest {
  questionTitle?: string;
  questionContent?: string;
}

export interface CreateAnswerRequest {
  userId: string;
  answerContent: string;
}

export interface UpdateAnswerRequest {
  answerContent: string;
}

export interface ReactToAnswerRequest {
  userId: string;
  emoji: string;
}

export const VALID_REACTIONS = ["👍", "❤️", "😂", "🎉", "🤔", "🔥"] as const;
export type ReactionEmoji = (typeof VALID_REACTIONS)[number];

export const FORUM_TAGS = [
  "Interviews",
  "Internships",
  "Resume",
  "Networking",
  "Offers",
  "Machine Learning",
  "General",
] as const;
export type ForumTag = (typeof FORUM_TAGS)[number];