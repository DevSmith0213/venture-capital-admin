import mongoose, { models } from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    desc: String,
    continent: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Country = models.Country || mongoose.model("Country", countrySchema);
export default Country;
