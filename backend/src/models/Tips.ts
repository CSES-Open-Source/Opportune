import { InferSchemaType, Schema, model } from "mongoose";

const tipSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

type Tips = InferSchemaType<typeof tipSchema>;

export default model<Tips>("Tips", tipSchema);
