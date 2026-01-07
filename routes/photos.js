const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  uploadPhoto,
  uploadMultiplePhotos,
  getPhotos,
  updatePhoto,
  deletePhoto,
} = require("../controllers/photosController");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// ADMIN ENDPOINTS - Upload & Manage Photos

// @route   POST /api/photos/upload
// @desc    Upload a single photo (Admin only)
// @access  Private (Admin)
router.post("/upload", auth, isAdmin, upload.single("photo"), uploadPhoto);

// @route   POST /api/photos/upload-multiple
// @desc    Upload multiple photos (Admin only)
// @access  Private (Admin)
router.post(
  "/upload-multiple",
  auth,
  isAdmin,
  upload.array("photos", 10),
  uploadMultiplePhotos
);

// PUBLIC ENDPOINT - View Photos Only
// @route   GET /api/photos
// @desc    Get all photos (simple gallery view)
// @access  Public
router.get("/", getPhotos);

// ADMIN ENDPOINTS - Update & Delete
// @route   PUT /api/photos/:id
// @desc    Update photo details (Admin only)
// @access  Private (Admin)
router.put("/:id", auth, isAdmin, updatePhoto);

// @route   DELETE /api/photos/:id
// @desc    Delete a photo (Admin only)
// @access  Private (Admin)
router.delete("/:id", auth, isAdmin, deletePhoto);

module.exports = router;
