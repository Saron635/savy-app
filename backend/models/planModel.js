import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  text: String,
  month: Number,
  year: Number
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
