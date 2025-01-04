import mongoose, { Document, Model } from "mongoose";
const { Schema, model, models } = mongoose;

interface Message extends Document {
  userId: string;
  message: string;
  createdAt: Date;
  type: string;
}

const UserSchema = new Schema<Message>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
});

const Message: Model<Message> =
  models.Message || model<Message>("Message", UserSchema);

export default Message;
