import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// GET all transactions
router.get("/", getTransactions);

// POST a new transaction
router.post("/", addTransaction);

// DELETE a transaction by ID
router.delete("/:id", deleteTransaction);

export default router;
