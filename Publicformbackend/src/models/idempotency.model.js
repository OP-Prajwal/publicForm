// src/models/idempotency.model.js

import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true,
    },

    response: {
      type: Object,
    },

    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED"],
      default: "PROCESSING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Idempotency", idempotencySchema);