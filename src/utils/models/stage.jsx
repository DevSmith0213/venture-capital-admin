import mongoose, { models } from "mongoose";

const stageSchema = new mongoose.Schema(
  {
    title: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Stage = models.Stage || mongoose.model("Stage", stageSchema);
export default Stage;
