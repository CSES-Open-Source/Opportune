import { InferSchemaType, Schema, model } from "mongoose";

/* eslint-disable no-unused-vars */
export enum UserType {
  Student = "STUDENT",
  Alumni = "ALUMNI",
  Admin = "ADMIN",
}
/* eslint-enable no-unused-vars */

const userSchema = new Schema({
  _id: {
    // ID generated by Google Oauth, must be called _id to be queried with .findById()
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Pass in from google
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(UserType),
    default: UserType.Student,
  },
  linkedIn: {
    type: String,
    required: false,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
  // Only for students
  major: {
    type: String,
    required: false,
    trim: true,
  },
  // Only for students
  classLevel: {
    type: String,
    required: false, // also eventually an enum?
  },
  // Only for alumni
  position: {
    type: String,
    required: false,
    trim: true,
  },
  // Only for alumni
  company: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  // Only for alumni
  shareProfile: {
    type: Boolean,
    required: false,
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
