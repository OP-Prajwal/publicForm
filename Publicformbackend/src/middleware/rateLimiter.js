// src/middleware/rateLimiter.js

import rateLimit from "express-rate-limit";

export const formLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 requests per minute per IP

  message: {
    message: "Too many requests, please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,
});