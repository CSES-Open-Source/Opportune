import { InferSchemaType, Schema, model } from "mongoose";

const tipSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

type Tips = InferSchemaType<typeof tipSchema>;

export default model<Tips>("Tips", tipSchema);
