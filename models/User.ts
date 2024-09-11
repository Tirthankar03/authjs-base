import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String},
  name: {type: String},
  email: { type: String, required: true },
  password: { type: String, select: false },
  role: { type: String, default: "user" },
  image: { type: String },
  authProviderId: { type: String },
  emailVerified: {type: Date}
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
