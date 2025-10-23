import Transaction from "../models/TransactionModel.js";
export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
};

export const addTransaction = async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
