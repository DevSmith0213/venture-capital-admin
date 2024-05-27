import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    country: String,
    linkedin: String,
    avatar: String,
    role: String,
    level: String,
    description: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
