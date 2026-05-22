import { InferSchemaType, Schema, model } from "mongoose";

export const VALID_REACTIONS = ["👍", "❤️", "😂", "🎉", "🤔", "🔥"] as const;
export type ReactionEmoji = (typeof VALID_REACTIONS)[number];

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
      type: Map,
      of: Number,
      default: () => new Map(VALID_REACTIONS.map((emoji) => [emoji, 0])),
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
