import { InferSchemaType, Schema, model } from "mongoose";

const interviewQuestionSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

type InterviewQuestion = InferSchemaType<typeof interviewQuestionSchema>;

export default model<InterviewQuestion>(
  "InterviewQuestion",
  interviewQuestionSchema,
);
