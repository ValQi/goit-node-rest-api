const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Перейменувати authMiddleware на authMiddleware.js
const UserController = require("../controllers/usersController.js"); // Перейменувати UserController на UserController.js

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);

router.get("/current", authMiddleware, UserController.getCurrentUser);
router.post("/logout", authMiddleware, UserController.logout);

module.exports = router;