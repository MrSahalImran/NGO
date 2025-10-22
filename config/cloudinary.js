const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Validate Cloudinary config on load
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("⚠️  Cloudinary credentials missing in environment variables");
  console.error(
    "Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
  );
}

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  // Configure storage dynamically based on field name/mime type
  params: async (req, file) => {
    const isPaymentProof = file.fieldname === "paymentProof";
    const isImage = file.mimetype && file.mimetype.startsWith("image/");

    return {
      folder: isPaymentProof ? "ngo-donations" : "ngo-photos",
      // Allow PDF only for payment proofs; images allowed everywhere
      allowed_formats: isPaymentProof
        ? ["jpg", "jpeg", "png", "gif", "webp", "pdf"]
        : ["jpg", "jpeg", "png", "gif", "webp"],
      // Apply transformations only for images
      transformation: isImage
        ? [
            { width: 1200, height: 1200, crop: "limit" }, // Limit max size
            { quality: "auto" }, // Auto quality optimization
          ]
        : undefined,
    };
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const isPaymentProof = file.fieldname === "paymentProof";
  const allowedTypes = isPaymentProof
    ? /jpeg|jpg|png|gif|webp|pdf/
    : /jpeg|jpg|png|gif|webp/;
  const mimetypeOk = allowedTypes.test(file.mimetype);

  if (mimetypeOk) {
    cb(null, true);
  } else {
    const msg = isPaymentProof
      ? "Only image or PDF files are allowed for payment proof"
      : "Only image files are allowed (JPEG, PNG, GIF, WEBP)";
    cb(new Error(msg), false);
  }
};

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

module.exports = { upload, cloudinary };
