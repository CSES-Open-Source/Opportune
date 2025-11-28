import mongoose, { Schema, Document, Model } from 'mongoose';

export interface StudentDocument extends Document {
  userId: string;
}

const StudentSchema = new Schema<StudentDocument>(
  {
    userId: {
      type: String,
      required: true
    }
  }
);

const Student: Model<StudentDocument> = mongoose.model<StudentDocument>('Student', StudentSchema);
export default Student;