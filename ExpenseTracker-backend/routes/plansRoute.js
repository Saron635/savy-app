import express from "express";
import {
  getPlans,
  addPlan,
  deletePlan,
} from "../controllers/planController.js";

const router = express.Router();

// GET plans for a specific month/year
router.get("/", getPlans);

// POST a new plan
router.post("/", addPlan);

// DELETE a plan by ID
router.delete("/:id", deletePlan);

export default router;
