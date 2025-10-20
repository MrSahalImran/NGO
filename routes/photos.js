const express = require("express");
const router = express.Router();
const Photo = require("../models/Photo");
const auth = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// ============================================
// ADMIN ENDPOINTS - Upload & Manage Photos
// ============================================

// @route   POST /api/photos/upload
// @desc    Upload a single photo (Admin only)
// @access  Private (Admin)
router.post(
  "/upload",
  auth,
  isAdmin,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image file" });
      }

      const { title, description } = req.body;

      if (!title) {
        // Delete the uploaded image from Cloudinary if validation fails
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(400).json({ message: "Title is required" });
      }

      const photo = new Photo({
        title,
        description: description || "",
        imageUrl: req.file.path, // Cloudinary URL
        cloudinaryId: req.file.filename, // Cloudinary public ID
        uploadedBy: req.user.id,
      });

      await photo.save();
      await photo.populate("uploadedBy", "name email");

      res.status(201).json({
        message: "Photo uploaded successfully",
        photo,
      });
    } catch (error) {
      console.error("Upload error:", error);
      // Delete uploaded file from Cloudinary if database save fails
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (deleteError) {
          console.error("Error deleting file from Cloudinary:", deleteError);
        }
      }
      res
        .status(500)
        .json({ message: "Server error during upload", error: error.message });
    }
  }
);

// @route   POST /api/photos/upload-multiple
// @desc    Upload multiple photos (Admin only)
// @access  Private (Admin)
router.post(
  "/upload-multiple",
  auth,
  isAdmin,
  upload.array("photos", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "Please upload at least one image file" });
      }

      const { title, description } = req.body;

      const photos = await Promise.all(
        req.files.map(async (file) => {
          const photo = new Photo({
            title: title || "Untitled",
            description: description || "",
            imageUrl: file.path,
            cloudinaryId: file.filename,
            uploadedBy: req.user.id,
          });
          await photo.save();
          return photo;
        })
      );

      // Populate user info for all photos
      await Photo.populate(photos, {
        path: "uploadedBy",
        select: "name email",
      });

      res.status(201).json({
        message: `${photos.length} photo(s) uploaded successfully`,
        photos,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res
        .status(500)
        .json({ message: "Server error during upload", error: error.message });
    }
  }
);

// ============================================
// PUBLIC ENDPOINT - View Photos Only
// ============================================

// @route   GET /api/photos
// @desc    Get all photos (simple gallery view)
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Get only active photos
    const photos = await Photo.find({ isActive: true })
      .select("title description imageUrl createdAt")
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    console.error("Fetch photos error:", error);
    res
      .status(500)
      .json({ message: "Server error fetching photos", error: error.message });
  }
});

// ============================================
// ADMIN ENDPOINTS - Update & Delete
// ============================================

// @route   PUT /api/photos/:id
// @desc    Update photo details (Admin only)
// @access  Private (Admin)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const { title, description, isActive } = req.body;

    if (title !== undefined) photo.title = title;
    if (description !== undefined) photo.description = description;
    if (isActive !== undefined) photo.isActive = isActive;

    await photo.save();
    await photo.populate("uploadedBy", "name email");

    res.json({
      message: "Photo updated successfully",
      photo,
    });
  } catch (error) {
    console.error("Update photo error:", error);
    res
      .status(500)
      .json({ message: "Server error updating photo", error: error.message });
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete a photo (Admin only)
// @access  Private (Admin)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(photo.cloudinaryId);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    await Photo.findByIdAndDelete(req.params.id);

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Delete photo error:", error);
    res
      .status(500)
      .json({ message: "Server error deleting photo", error: error.message });
  }
});

module.exports = router;
