import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" }); // backend URL

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);

export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories", data);

export const getPlans = () => API.get("/plans");
export const addPlan = (data) => API.post("/plans", data);
