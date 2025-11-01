const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const householdRoutes = require("./routes/households");
const citizenRoutes = require("./routes/citizens");
const requestRoutes = require("./routes/requests");
const rewardRoutes = require("./routes/rewards");
const notificationRoutes = require("./routes/notifications");
const auditRoutes = require("./routes/audit");

app.use(cors());
app.use(express.json());

require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error:", error);
  }
};

const startServer = async () => {
  await connectDB();

  // Routes
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/households", householdRoutes);
  app.use("/citizens", citizenRoutes);
  app.use("/requests", requestRoutes);
  app.use("/rewards", rewardRoutes);
  app.use("/events", require('./routes/events'));
  app.use("/notifications", notificationRoutes);
  app.use("/audit", auditRoutes);

  // Basic health route
  app.get("/health", (req, res) => res.json({ ok: true }));

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  });

  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
  // start background scheduler (generate recurring events, open/close events)
  try {
    const scheduler = require('./scripts/scheduler');
    if (scheduler && typeof scheduler.startScheduler === 'function') scheduler.startScheduler();
  } catch (err) {
    console.error('Failed to start scheduler:', err);
  }
};

startServer();
