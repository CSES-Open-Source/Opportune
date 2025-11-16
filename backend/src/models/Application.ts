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
    companyName: {
      type: String,
      required: true,
      trim: true,
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

export type ApplicationStatus = InferSchemaType<typeof applicationStatusSchema>;
type Application = InferSchemaType<typeof applicationSchema>;

// Add indexes for better performance
applicationSchema.index({ userId: 1 }); // User's applications
applicationSchema.index({ userId: 1, createdAt: -1 }); // User's recent applications
applicationSchema.index({ company: 1 }); // Company filtering
applicationSchema.index({ position: "text" }); // Position search

export default model<Application>("Application", applicationSchema);
