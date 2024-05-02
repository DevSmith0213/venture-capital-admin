import mongoose, { models } from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    link: String,
    image: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Banner = models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
