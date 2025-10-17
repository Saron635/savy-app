import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "./routes/transactionsRoute.js";
import planRoutes from "./routes/plansRoute.js";
import categoryRoutes from "./routes/categoriesRoutes.js"; // Verify this path
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Enhanced CORS for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Finance Tracker API is running!',
    timestamp: new Date().toISOString(),
    routes: {
      categories: '/api/categories',
      transactions: '/api/transactions',
      plans: '/api/plans',
      auth: '/api/auth'
    }
  });
});

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: `Route ${req.originalUrl} not found` });
// });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB URI: ${process.env.MONGO_URI ? 'Set' : 'NOT SET'}`);
});