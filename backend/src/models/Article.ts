import { InferSchemaType, Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    _id: {
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
    content: {
      type: String,
      required: true,
    },
  },
  {
    // Set timestamps on model to automatically generate
    timestamps: true,
  },
);

type Article = InferSchemaType<typeof articleSchema>;

export default model<Article>("Article", articleSchema);