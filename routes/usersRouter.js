const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

router.get("/current", authMiddleware, UserController.getCurrentUser);
router.post("/logout", authMiddleware, UserController.logout);

module.exports = router;