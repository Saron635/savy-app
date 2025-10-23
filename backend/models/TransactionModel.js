import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  type: { type: String, enum: ["income", "expense"] },
  date: Date
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
