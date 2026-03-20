// src/middleware/requestId.js

import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (req, res, next) => {
  req.requestId = "req_" + uuidv4();
  next();
};