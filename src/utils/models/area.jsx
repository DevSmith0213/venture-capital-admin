import mongoose, { models } from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    title: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Area = models.Area || mongoose.model("Area", areaSchema);
export default Area;
