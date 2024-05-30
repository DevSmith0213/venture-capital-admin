import mongoose, { models } from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Newsletter = models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;
