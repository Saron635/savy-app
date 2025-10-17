import express from "express";
import Category from "../models/categoryModel.js";

const router = express.Router();

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// ✅ Add a new category
router.post("/", async (req, res) => {
  const { name, color, icon } = req.body;

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      console.log("⚠️ Category already exists:", existingCategory);
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, color, icon });
    const savedCategory = await newCategory.save();

    console.log("✅ Category saved:", savedCategory);
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error saving category:", err);
    res.status(500).json({ message: "Failed to save category" });
  }
});

export default router;
