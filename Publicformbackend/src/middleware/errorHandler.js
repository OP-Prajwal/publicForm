// src/middleware/errorHandler.js

export const globalErrorHandler = (err, req, res, next) => {
  console.error(`[${req.requestId || 'UNKNOWN_REQ'}] Uncaught Exception:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    status: "error",
    message: statusCode === 500 ? "Internal server error" : message,
    requestId: req.requestId,
    // Only send stack in development and if they exist
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
