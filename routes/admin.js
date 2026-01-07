const express = require("express");
const adminAuth = require("../middleware/admin");
const { getDashboard, getUsers } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", adminAuth, getDashboard);

// Get all users
router.get("/users", adminAuth, getUsers);

module.exports = router;
