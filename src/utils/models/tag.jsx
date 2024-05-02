import mongoose, { models } from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    title: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Tag = models.Tag || mongoose.model("Tag", tagSchema);
export default Tag;
