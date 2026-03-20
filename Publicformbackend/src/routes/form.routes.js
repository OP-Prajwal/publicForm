// src/routes/form.routes.js

import express from "express";
import { submitForm, getToken } from "../controllers/form.controller.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/token", getToken);
router.post("/submit", formLimiter, submitForm);

export default router;