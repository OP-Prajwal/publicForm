// src/services/idempotency.service.js

import Idempotency from "../models/idempotency.model.js";

export const handleIdempotency = async (key) => {
  let record = await Idempotency.findOne({ key });

  // If already completed -> return stored response
  if (record && record.status === "COMPLETED") {
    return {
      isDuplicate: true,
      response: record.response,
    };
  }

  // If already processing -> halt the duplicate request safely
  if (record && record.status === "PROCESSING") {
    throw new Error("Concurrent Request: This request is already being processed.");
  }

  // If not exists -> create new
  if (!record) {
    record = await Idempotency.create({
      key,
      status: "PROCESSING",
    });
  }

  return {
    isDuplicate: false,
    record,
  };
};

export const completeIdempotency = async (key, responseData) => {
  return await Idempotency.findOneAndUpdate(
    { key },
    {
      status: "COMPLETED",
      response: responseData,
    },
    { new: true }
  );
};