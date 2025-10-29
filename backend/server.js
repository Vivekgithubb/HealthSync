require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const helmet = require("helmet");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctors");
const appointmentRoute = require("./routes/appointments");
const documentRoutes = require("./routes/documents");
const pharmacyRoutes = require("./routes/pharmacy");
const visitRoutes = require("./routes/visits");
const xss = require("xss");
const rateLimit = require("express-rate-limit");
const { sendAppointmentReminders } = require("./utils/reminderService");

// Connect to database
connectDB();

const app = express();
// Middleware
app.use(
  cors({
    // origin: [
    //   process.env.FRONTEND_URL,
    //   "http://localhost:5173",
    //   "http://192.168.1.128:5173",
    // ],
    origin: true,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //100 requests from same ip in a hour
  message: "too many requests from this IP , please try again in an hour",
});
app.use("/api", limiter); //onlyfor all routes starting with api
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//requrests limit from same api

//Data sanitizaion against noSQL query injection

// 🛡️ Custom NoSQL Injection Sanitizer
// 🧹 NoSQL injection sanitizer

// 🛡️ NoSQL Injection & XSS Protection Middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const val = obj[key];

      // 🚫 Prevent MongoDB operators like $gt, $or, etc.
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
        continue;
      }

      // 🧼 Sanitize strings for XSS
      if (typeof val === "string") {
        obj[key] = xss(val, {
          whiteList: {}, // remove all HTML tags
          stripIgnoreTag: true,
          stripIgnoreTagBody: ["script"],
        });
      }

      // Recursively sanitize nested objects
      if (typeof val === "object" && val !== null) sanitize(val);
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/appointments", appointmentRoute);
app.use("/api/pharmacy", pharmacyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "HealthSync API is running" });
});

// Cron job for appointment reminders - runs every day at 9 AM
cron.schedule("*/3 * * * *", async () => {
  console.log("Running appointment reminder job...");
  try {
    await sendAppointmentReminders();
  } catch (error) {
    console.error("Error in reminder cron job:", error);
  }
});

// For testing, you can also trigger reminders manually
app.post("/api/reminders/send", async (req, res) => {
  try {
    await sendAppointmentReminders();
    res.json({ message: "Reminders sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending reminders", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
