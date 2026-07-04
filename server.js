const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());

// CORS: restrict to an allow-list in production, reflect any origin in dev.
// Configure via CORS_ORIGINS (comma-separated) or CLIENT_URL.
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, server-to-server) with no Origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // No allow-list configured → permissive in dev only, closed in prod
      if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ngo_website", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes - with error handling and logging
const routes = [
  { path: "/api/auth", file: "./routes/auth" },
  { path: "/api/registrations", file: "./routes/registrations" },
  { path: "/api/admin", file: "./routes/admin" },
  { path: "/api/contact", file: "./routes/contact" },
  { path: "/api/ngo", file: "./routes/ngo" },
  { path: "/api/photos", file: "./routes/photos" },
  { path: "/api/donations", file: "./routes/donations" },
];

routes.forEach(({ path, file }) => {
  try {
    app.use(path, require(file));
    console.log(`✓ Route registered: ${path}`);
  } catch (error) {
    console.error(`✗ Failed to load route ${path}:`, error.message);
  }
});

// Health check endpoint for debugging
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    routes: routes.map((r) => r.path),
    cloudinary: {
      configured: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
    },
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Unmatched API routes → JSON 404 (never fall through to the SPA handler)
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Serve the built frontend only if it's actually present (i.e. this deploy
// also built the client). When the backend runs API-only — frontend hosted
// separately, e.g. on Vercel — skip it and expose a small status at "/".
const clientIndex = path.join(__dirname, "client/dist", "index.html");
if (process.env.NODE_ENV === "production" && fs.existsSync(clientIndex)) {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => res.sendFile(clientIndex));
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      service: "Vridh Ashram API",
      health: "/api/health",
    });
  });
}

// Global error handler — return clean JSON instead of leaking HTML stack
// traces. Handles Multer upload failures and file-type rejections.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Multer errors (file too large, too many files, unexpected field, etc.)
  if (err && err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum size is 5MB."
        : `Upload error: ${err.message}`;
    return res.status(400).json({ message });
  }

  // File-type rejection raised by the Cloudinary storage fileFilter
  if (err && err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled error:", err);
  const payload = { message: "Server error" };
  if (process.env.NODE_ENV === "development") payload.error = err.message;
  res.status(500).json(payload);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("Registered routes:");
  routes.forEach(({ path }) => console.log(`  ${path}`));
});
