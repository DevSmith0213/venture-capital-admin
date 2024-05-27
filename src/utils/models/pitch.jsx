import mongoose, { models } from "mongoose";

const pitchSchema = new mongoose.Schema(
  {
    startup_id: String,
    fund_id: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Pitch = models.Pitch || mongoose.model("Pitch", pitchSchema);
export default Pitch;
