// src/services/token.service.js

import crypto from "crypto";
import Token from "../models/token.model.js";

export const generateNewToken = async () => {
  const tokenStr = crypto.randomBytes(32).toString("hex");
  const newToken = await Token.create({ token: tokenStr });
  return newToken.token;
};

export const validateAndUseToken = async (tokenValue) => {
  const tokenDoc = await Token.findOneAndUpdate(
    {
      token: tokenValue,
      used: false, // only unused tokens
    },
    {
      $set: { used: true }, // mark as used
    },
    {
      new: true,
    }
  );

  if (!tokenDoc) {
    return false; // invalid or already used
  }

  return true;
};