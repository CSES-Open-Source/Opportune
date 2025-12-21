import mongoose, { Schema, Document, Model } from "mongoose";

export interface StudentDocument extends Document {
  userId: string;
  school: string;
  fieldOfInterest: [string];
  projects: [string];
  hobbies: [string];
  skills: [string];
  companiesOfInterest: [string];
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
    required: false,
  },
  projects: {
    type: [String],
    required: false,
  },
  hobbies: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: false,
  },
  companiesOfInterest: {
    type: [String],
    required: false,
  },
});

const Student: Model<StudentDocument> = mongoose.model<StudentDocument>(
  "Student",
  StudentSchema,
);
export default Student;
