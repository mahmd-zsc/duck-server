// error-handler.middleware.js

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    if (err.name === "ValidationError") {
      // Handle Mongoose validation errors
      statusCode = 400;
      message = "Validation Error";
    }
  
    // Log the error for debugging purposes
    console.error(err);
  
    res.status(statusCode).json({ error: message });
  };
  
  module.exports = errorHandler;
  