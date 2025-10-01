const express = require("express");
const { body, validationResult } = require("express-validator");
const Registration = require("../models/Registration");

const router = express.Router();

// Create registration
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("dateOfBirth")
      .isISO8601()
      .withMessage("Please provide a valid date of birth"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender must be Male, Female, or Other"),
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

      const registrationData = req.body;
      const registration = new Registration(registrationData);

      await registration.save();
      res
        .status(201)
        .json({ message: "Registration submitted successfully", registration });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Get all registrations (for admin)
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get registration by ID
router.get("/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json(registration);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Update registration status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(registration);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
