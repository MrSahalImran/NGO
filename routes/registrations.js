const express = require("express");
const { body, validationResult } = require("express-validator");
const Registration = require("../models/Registration");
const { sendMailSafe } = require("../utils/mailer");
const logger = require("../utils/logger");

const router = express.Router();

/**
 * CREATE REGISTRATION
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please include a valid email"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("dateOfBirth")
      .isISO8601()
      .withMessage("Please provide a valid date of birth"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),
    body("emergencyContact.email")
      .notEmpty()
      .withMessage("Emergency contact email is required")
      .bail()
      .isEmail()
      .withMessage("Please include a valid emergency contact email"),
    body("emergencyContact.name")
      .notEmpty()
      .withMessage("Emergency contact name is required"),
    body("emergencyContact.phone")
      .notEmpty()
      .withMessage("Emergency contact phone is required"),
    body("emergencyContact.relationship")
      .notEmpty()
      .withMessage("Emergency contact relationship is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const registration = new Registration(req.body);
      await registration.save();

      logger.log("[registrations] New registration created:", registration._id);

      res
        .status(201)
        .json({ message: "Registration submitted successfully", registration });
    } catch (error) {
      logger.error("[registrations] Create error:", error);
      if (process.env.NODE_ENV === "development") {
        return res
          .status(500)
          .json({
            message: "Server error",
            error: error.message,
            stack: error.stack,
          });
      }
      res.status(500).send("Server error");
    }
  }
);

/**
 * GET ALL REGISTRATIONS (ADMIN)
 */
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    logger.error("[registrations] Fetch all error:", error);
    res.status(500).send("Server error");
  }
});

/**
 * GET REGISTRATION BY ID
 */
router.get("/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    res.json(registration);
  } catch (error) {
    logger.error("[registrations] Fetch by ID error:", error);
    res.status(500).send("Server error");
  }
});

/**
 * UPDATE REGISTRATION STATUS
 */
router.patch("/:id/status", async (req, res) => {
  try {
    logger.log(`[registrations] PATCH status called`, req.params.id, req.body);

    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    logger.log(
      "[registrations] Status updated",
      registration._id,
      registration.status
    );

    // SEND EMAIL ON APPROVAL (BEST-EFFORT)
    if (status === "approved") {
      const toEmail =
        registration.email || registration.emergencyContact?.email;
      if (toEmail) {
        try {
          const subject = "Resident Admission Approved";
          const text = `Dear ${
            registration.name || "Applicant"
          },\n\nWe are pleased to inform you that your resident admission request has been approved.\n\nOur admissions team will contact you with next steps and further instructions.\n\nRegards,\nVirdh Ashram`;
          const html = `<p>Dear ${
            registration.name || "Applicant"
          },</p><p><strong>We are pleased to inform you</strong> that your resident admission request has been <strong>approved</strong>.</p><p>Our admissions team will contact you with next steps and further instructions.</p><p>Regards,<br/>Virdh Ashram</p>`;

          const mailOptions = { to: toEmail, subject, text, html };
          const mailResult = await sendMailSafe(mailOptions);
          if (!mailResult.ok)
            logger.warn(
              "[registrations] Email failed",
              mailResult.error || mailResult
            );
        } catch (mailError) {
          logger.error("[registrations] Email sending exception:", mailError);
        }
      }
    }

    res.json(registration);
  } catch (error) {
    logger.error("[registrations] Status update error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
