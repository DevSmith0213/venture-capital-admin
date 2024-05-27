import mongoose, { models } from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    name: String,
    oneDescription: String,
    logo: String,
    website: String,
    social: String,
    stageList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage'
    }],
    areasList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area'
    }],
    deckURL: String,
    capital: String,
    raising: String,
    referred: String,
    summary: String,
    user_id: String,
    isActive: { type: Boolean, default: true, },
  },
  { timestamps: true }
);

const Startup = models.Startup || mongoose.model("Startup", startupSchema);
export default Startup;
