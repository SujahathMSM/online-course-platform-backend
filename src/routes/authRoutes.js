const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware")
// @route   POST /api/auth/signup
router.post("/signup", userController.signup);

// @route   POST /api/auth/signup
router.post("/login", userController.login);

router.get("/profile", verifyToken, userController.getProfile)

module.exports = router;
