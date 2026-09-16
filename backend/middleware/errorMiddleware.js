const mongoose = require("mongoose");

// ============================================
// Error Handler
// ============================================

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Invalid MongoDB ObjectId
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value",
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Server error",
  });
};

module.exports = errorHandler;