// src/services/captcha.service.js

import axios from "axios";

export const verifyCaptcha = async (captchaToken) => {
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: captchaToken,
      })
    );

    if (!response.data.success) {
      console.error("Captcha verification failed at Cloudflare:", response.data);
    }
    
    return response.data.success;
  } catch (error) {
    console.error("Axios Error in captcha validation:", error.message);
    return false;
  }
};