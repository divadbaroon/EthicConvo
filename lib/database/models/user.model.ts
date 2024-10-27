import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  clerkId: { type: String, required: true, unique: true },
  sessionId: { type: String},
  lastActive: { type: Date, default: null },
  isActive: { type: Boolean, default: false },
});

export const User = models?.User || model("User", UserSchema);