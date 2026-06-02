import { InferSchemaType, Schema, model } from "mongoose";

const questionSchema = new Schema(
  {
    questionTitle: {
      type: String,
      trim: true,
      required: true,
    },
    questionContent: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    answers: {
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

questionSchema.index({ questionTitle: "text", questionContent: "text" });
questionSchema.index({ userId: 1 });

type Question = InferSchemaType<typeof questionSchema>;

export default model<Question>("Question", questionSchema);
