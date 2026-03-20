// src/validations/form.validation.js

import { z } from "zod";

export const formValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  branch: z.string().min(2, "Branch is required"),
  token: z.string().min(1, "Access token is required"),
  idempotencyKey: z.string().uuid("Invalid idempotency key format").optional().or(z.string().min(1)),
  captchaToken: z.string().optional()
});
