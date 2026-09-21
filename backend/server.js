const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);


// --- Database connection ---
// Cache the connection across serverless invocations so a warm Lambda
// doesn't reconnect to MongoDB on every single request.
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    console.error(
      "MONGO_URI is not set. Add it in your environment (.env locally, " +
        "Vercel Project Settings > Environment Variables in production)."
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  }
}

// Kick off the connection as soon as this module loads (helps warm
// invocations skip the wait below).
connectDB();

// IMPORTANT: this must be registered BEFORE any route that touches the
// database, so every request waits for a live connection first. This
// was previously placed after the routes, which meant it never ran in
// time and caused "buffering timed out" errors on cold starts.
app.use(async (req, res, next) => {
  await connectDB();
  next();
});


// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
  });
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);


// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// Error middleware
app.use(errorHandler);


// --- Local dev only ---
// On Vercel, app.listen() is never used — Vercel invokes the exported
// app directly as a serverless function per request. Only start a real
// listener when running locally / on a traditional host.
if (process.env.VERCEL !== "1" && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Required so Vercel's @vercel/node runtime can invoke this as a
// serverless function.
module.exports = app;