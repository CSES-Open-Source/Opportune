import mongoose, { Schema, Document, Model } from 'mongoose';

export interface AlumniDocument extends Document {
  userId: string;
}

const AlumniSchema = new Schema<AlumniDocument>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true
    }
  }
);

const Alumni: Model<AlumniDocument> = mongoose.model<AlumniDocument>('Alumni', AlumniSchema);
export default Alumni;