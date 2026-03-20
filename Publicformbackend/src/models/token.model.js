// src/models/token.model.js

import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Token", tokenSchema);