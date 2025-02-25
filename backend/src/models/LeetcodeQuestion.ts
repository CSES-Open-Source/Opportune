import { InferSchemaType, Schema, model } from "mongoose";

const leetcodeQuestionSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

type LeetcodeQuestion = InferSchemaType<typeof leetcodeQuestionSchema>;

export default model<LeetcodeQuestion>(
  "LeetcodeQuestion",
  leetcodeQuestionSchema,
);
