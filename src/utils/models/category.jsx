import mongoose, { models } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: String,
    route: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Category = models.Category || mongoose.model("Category", categorySchema);
export default Category;
