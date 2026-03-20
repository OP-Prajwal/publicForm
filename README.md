# Public Form Architecture Demo

This repository demonstrates how to securely build and structure a public-facing React form with a secure Node.js/Express backend. It showcases enterprise-grade techniques to prevent spam, duplicate submissions, and API abuse.

## Features

* **Cloudflare Turnstile CAPTCHA**: Stops bots natively without friction.
* **Idempotency Keys**: Prevents accidental duplicate submissions if the user clicks "Submit" twice or the network drops.
* **CSPRNG Tokens**: Automatically fetches cryptographically secure tokens on form open to track submission authenticity.
* **Zod Validation**: Strict schema validation ensures only perfectly shaped data reaches your database.
* **Rate Limiting & Helmet**: Prevents API abuse and sets secure HTTP headers.
* **Glassmorphism UI**: A sleek, modern, fully responsive React frontend built beautifully with Vanilla CSS.

## Getting Started

To run this demo locally, you simply need to start both the frontend and backend development servers.

### 1. Start the Backend
```bash
cd Publicformbackend
npm install
npm run dev
```
*The backend runs on `http://localhost:5000` and uses your local MongoDB instance (`mongodb://localhost:27017`).*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The React frontend runs natively on Vite (`http://localhost:5173`) and automatically communicates with the backend.*

## The Security Flow

1. **Form Opens (Frontend)**: React fetches a secure CSPRNG Session Token (`GET /api/form/token`).
2. **User Submits (Frontend)**: React generates a unique local Idempotency Key, seamlessly completes the Cloudflare Turnstile challenge, and posts the payload.
3. **Validation (Backend)**: Zod strictly verifies the payload shape (Name, Email, Branch).
4. **Authenticity (Backend)**: The CAPTCHA is validated directly against Cloudflare's API, and the CSPRNG token is verified and immediately burned (One-time-use logic).
5. **Idempotency Check (Backend)**: If the user double-clicked submit, the backend safely skips the database insertion, blocking duplicates without throwing an error.
6. **Data Storage (Backend)**: Clean, validated, human-only data is stored in MongoDB!
