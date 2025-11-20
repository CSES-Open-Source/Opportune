import { InferSchemaType, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum Difficulty {
  Easy = "EASY",
  Medium = "MEDIUM",
  Hard = "HARD",
}

const leetcodeQuestionSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: Object.values(Difficulty),
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
});

type LeetcodeQuestion = InferSchemaType<typeof leetcodeQuestionSchema>;

// Add indexes for better performance
leetcodeQuestionSchema.index({ difficulty: 1 }); // Difficulty filtering
leetcodeQuestionSchema.index({ company: 1 }); // Company filtering
leetcodeQuestionSchema.index({ userId: 1 }); // User's questions
leetcodeQuestionSchema.index({ title: "text" }); // Title search

export default model<LeetcodeQuestion>(
  "LeetcodeQuestion",
  leetcodeQuestionSchema,
);
