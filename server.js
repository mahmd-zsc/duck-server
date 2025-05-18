const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const wordRoutes = require("./routes/wordRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizzesRoutes = require("./routes/quizRoutes");

const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get("/", (req, res) => res.send("API running..."));

//  //app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
// // app.use(`/api/${process.env.API_VERSION}/users`, userRoutes);
  app.use(`/api/${process.env.API_VERSION}/words`, wordRoutes);
  app.use(`/api/${process.env.API_VERSION}/lessons`, lessonRoutes);
  app.use(`/api/${process.env.API_VERSION}/quizzes`, quizzesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
