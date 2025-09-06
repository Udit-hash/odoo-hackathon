const express = require("express");
const {
  signupUser,
  signinUser,
  getLoggedInUserProfile,
} = require("../controllers/authController.js");

const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/me", authMiddleware, getLoggedInUserProfile);

module.exports = router;