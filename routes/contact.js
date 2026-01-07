const express = require("express");
const { body, validationResult } = require("express-validator");
const { sendContactEmail } = require("../controllers/contactController");

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  // validation handled inside controller; keeping middleware here for express-validator
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    return sendContactEmail(req, res, next);
  }
);

module.exports = router;
