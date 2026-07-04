const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin");
const { upload } = require("../config/cloudinary");
const {
  uploadPhoto,
  uploadMultiplePhotos,
  getPhotos,
  updatePhoto,
  deletePhoto,
} = require("../controllers/photosController");

// ADMIN ENDPOINTS - Upload & Manage Photos

// @route   POST /api/photos/upload
// @desc    Upload a single photo (Admin only)
// @access  Private (Admin)
router.post("/upload", adminAuth, upload.single("photo"), uploadPhoto);

// @route   POST /api/photos/upload-multiple
// @desc    Upload multiple photos (Admin only)
// @access  Private (Admin)
router.post(
  "/upload-multiple",
  adminAuth,
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
router.put("/:id", adminAuth, updatePhoto);

// @route   DELETE /api/photos/:id
// @desc    Delete a photo (Admin only)
// @access  Private (Admin)
router.delete("/:id", adminAuth, deletePhoto);

module.exports = router;
