import RecruitmentResponse from "../models/form.model.js";
import { validateAndUseToken, generateNewToken } from "../services/token.service.js";
import {
  handleIdempotency,
  completeIdempotency,
} from "../services/idempotency.service.js";
import { verifyCaptcha } from "../services/captcha.service.js";
import { formValidationSchema } from "../validations/form.validation.js";

export const getToken = async (req, res) => {
  try {
    const tokenStr = await generateNewToken();
    return res.status(200).json({
      message: "Token generated successfully",
      token: tokenStr
    });
  } catch (err) {
    console.error(`[${req.requestId}] Error generating token`, err);
    return res.status(500).json({
      message: "Internal server error",
      requestId: req.requestId
    });
  }
};

export const submitForm = async (req, res) => {
  try {
    const requestId = req.requestId;

    // 1. Strict payload validation with Zod
    const validationResult = formValidationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: validationResult.error.format(),
        requestId,
      });
    }

    const ObjectData = validationResult.data;
    const { name, email, branch, token, idempotencyKey } = ObjectData;
    
    // CAPTCHA check (FIRST)
    const isHuman = await verifyCaptcha(ObjectData.captchaToken);

    if (!isHuman) {
      return res.status(400).json({
        message: "Captcha verification failed",
        requestId,
      });
    }

    // 2. Idempotency check FIRST
    const { isDuplicate, response: oldResponse } =
      await handleIdempotency(idempotencyKey);

    if (isDuplicate) {
      return res.status(200).json({
        message: "Already processed",
        requestId,
        data: oldResponse,
      });
    }

    // 3. Token validation (WITH await)
    const isValidToken = await validateAndUseToken(token);

    if (!isValidToken) {
      return res.status(400).json({
        message: "Invalid or already used token",
        requestId,
      });
    }

    // 4. Save to DB
    const saved = await RecruitmentResponse.create({
      name,
      email,
      branch,
      token,
      idempotencyKey,
      requestId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // 5. Store idempotency response
    await completeIdempotency(idempotencyKey, saved);

    return res.status(200).json({
      message: "Form submitted successfully",
      requestId,
      data: saved,
    });
  } catch (err) {
    console.error(`[${req.requestId}] Error`, err);

    return res.status(500).json({
      message: "Internal server error",
      requestId: req.requestId,
    });
  }
};