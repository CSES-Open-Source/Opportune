import mongoose, { Schema, Document, Model } from "mongoose";

export interface AlumniDocument extends Document {
  userId: string;
  organizations: string[];
  previousEmployers: string[];
  specializations: string[];
  hobbies: string[];
  skills: string[];
}

const AlumniSchema = new Schema<AlumniDocument>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  organizations: {
    type: [String],
    required: true,
  },
  previousEmployers: {
    type: [String],
    required: true,
  },
  specializations: {
    type: [String],
    required: true,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const Alumni: Model<AlumniDocument> = mongoose.model<AlumniDocument>(
  "Alumni",
  AlumniSchema,
);
export default Alumni;
