import mongoose, { Document, Model } from "mongoose";
const { Schema, model, models } = mongoose;

interface User extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  lastSignInAt?: Date;
  profileUrl?: string;
}

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSignInAt: {
    type: Date,
  },
  profileUrl: {
    type: String,
  },
});

const User: Model<User> = models.User || model<User>("User", UserSchema);

export default User;
