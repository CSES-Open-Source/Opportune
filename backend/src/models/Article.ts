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

// Add indexes for better performance
articleSchema.index({ title: "text", content: "text" }); // Text search
articleSchema.index({ userId: 1 }); // User's articles
articleSchema.index({ createdAt: -1 }); // Recent articles

type Article = InferSchemaType<typeof articleSchema>;

export default model<Article>("Article", articleSchema);
