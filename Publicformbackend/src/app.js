// src/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import formRoutes from "./routes/form.routes.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

// Body parser
app.use(express.json());

// Request ID (tracking)
app.use(requestIdMiddleware);

// Routes
app.use("/api/form", formRoutes);

// Health check (important in production)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

// Global Error Handler (must be last middleware)
app.use(globalErrorHandler);

export default app;