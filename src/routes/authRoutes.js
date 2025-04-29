const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// @route   POST /api/auth/signup
router.post("/signup", userController.signup);

// @route   POST /api/auth/signup
router.post("/login", userController.login);

module.exports = router;
