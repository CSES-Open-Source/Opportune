import mongoose, { Schema, Document, Model } from "mongoose";

export interface StudentDocument extends Document {
  userId: string;
  school: string;
  fieldOfInterest: string[];
  projects: string[];
  hobbies: string[];
  skills: string[];
  companiesOfInterest: string[];
}

const StudentSchema = new Schema<StudentDocument>({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  school: {
    type: String,
    required: false,
  },
  fieldOfInterest: {
    type: [String],
    default: [],
  },
  projects: {
    type: [String],
    default: [],
  },
  hobbies: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  companiesOfInterest: {
    type: [String],
    default: [],
  },
});

const Student: Model<StudentDocument> = mongoose.model<StudentDocument>(
  "Student",
  StudentSchema,
);
export default Student;
