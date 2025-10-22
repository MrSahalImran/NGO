const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
  { path: "/api/payments", file: "./routes/payments" },
  { path: "/api/admin", file: "./routes/admin" },
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
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("Registered routes:");
  routes.forEach(({ path }) => console.log(`  ${path}`));
});
