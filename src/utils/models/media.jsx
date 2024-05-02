import mongoose, { Schema, models } from "mongoose";

const mediaSchema = new Schema(
  {
    title: String,
    imageSrc: String,
    paragraph: String,
    content: String,
    route: String,
    date: String,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Media = models.Media || mongoose.model("Media", mediaSchema);
export default Media;
