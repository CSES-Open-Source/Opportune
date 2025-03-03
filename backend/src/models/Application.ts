import { InferSchemaType, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum Status {
  Applied = "APPLIED",
  Oa = "OA",
  Phone = "PHONE",
  Final = "FINAL",
  Offer = "OFFER",
  Rejected = "REJECTED",
}

export enum SortingOptions {
  Applied = "APPLIED",
  Modified = "MODIFIED",
  Status = "STATUS",
  Company = "COMPANY",
  Position = "POSITION",
}

const applicationStatusSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(Status),
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
});

const applicationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    process: {
      type: [applicationStatusSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

type Application = InferSchemaType<typeof applicationSchema>;

export default model<Application>("Application", applicationSchema);
