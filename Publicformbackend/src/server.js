import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to Database
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    } else {
      console.warn("MONGO_URI not found in .env, skipping database connection...");
    }

    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async () => {
      console.log("Gracefully shutting down server...");
      server.close(() => console.log("HTTP server closed."));
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed.");
      }
      process.exit(0);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
