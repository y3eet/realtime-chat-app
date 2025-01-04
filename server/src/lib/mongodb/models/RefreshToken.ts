import mongoose, { Document, Model } from "mongoose";
const { Schema, model, models } = mongoose;

interface RefreshToken extends Document {
  token: string;
  userId: string;
  expiresAt: Date;
  deviceId?: string;
}

const RefreshTokenSchema = new Schema<RefreshToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  deviceId: {
    type: String,
  },
});

const RefreshToken: Model<RefreshToken> =
  models.RefreshToken ||
  model<RefreshToken>("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
