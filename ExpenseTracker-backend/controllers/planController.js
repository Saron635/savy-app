import Plan from "../models/planModel.js";

// Get plans for a specific month & year
export const getPlans = async (req, res) => {
  try {
    const { month, year } = req.query;
    const plans = await Plan.find({ month: Number(month), year: Number(year) }).sort({ _id: -1 });
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new plan
export const addPlan = async (req, res) => {
  try {
    const { text, month, year } = req.body;
    const plan = new Plan({ text, month, year });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a plan by ID
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
