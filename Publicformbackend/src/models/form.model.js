// src/models/recruitmentResponse.model.js

import mongoose from "mongoose";

const recruitmentResponseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ISE", "ECE", "EEE", "ME", "CIVIL", "OTHER"],
    },

    // Security & System Design Fields
    token: {
      type: String,
      required: true,
      index: true,
    },

    idempotencyKey: {
      type: String,
      required: true,
      index: true,
    },

    requestId: {
      type: String,
      required: true,
      index: true,
    },

    // Tracking (very useful in real systems)
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    // Metadata
    status: {
      type: String,
      enum: ["PENDING", "PROCESSED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "RecruitmentResponse",
  recruitmentResponseSchema
);