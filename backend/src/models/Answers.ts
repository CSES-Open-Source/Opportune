import { InferSchemaType, Schema, model } from "mongoose";

export const VALID_REACTIONS = ["👍", "❤️", "😂", "🎉", "🤔", "🔥"] as const;
export type ReactionEmoji = (typeof VALID_REACTIONS)[number];

const reactionSchema = new Schema(
  {
    userId: { type: String, required: true },
    emoji: { type: String, required: true },
  },
  { _id: false },
);

// Forward-declare so answerSchema can self-reference for replies
const answerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    answerContent: {
      type: String,
      trim: true,
      required: true,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    replies: {
      type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
      default: [],
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "modifiedDate" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

type Answer = InferSchemaType<typeof answerSchema>;

export default model<Answer>("Answer", answerSchema);