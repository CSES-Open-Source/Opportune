import { InferSchemaType, Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

type Article = InferSchemaType<typeof articleSchema>;

export default model<Article>("Article", articleSchema);
