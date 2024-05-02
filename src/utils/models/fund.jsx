import mongoose, { Schema, models } from "mongoose";

const fundSchema = new Schema({
  title: { type: String, required: true },
  location: String,
  logo: String,
  websites: [String],
  fundData: [{
    label: String,
    value: String
  }],
  route: String,
  stages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage'
  }],
  areas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  summary: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

const Fund = models.Fund || mongoose.model("Fund", fundSchema);

export default Fund;
