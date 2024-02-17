const express = require("express");
const ctrl = require("../controllers/usersController");
const { validateBody } = require("../helpers/validateBody");
const { registrationSchema, loginSchema } = require("../schemas/userSchemas");
const authMiddleware = require("../middleware/authMiddleware");

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registrationSchema), ctrl.registerUser);
usersRouter.post("/login", validateBody(loginSchema), ctrl.loginUser);
usersRouter.post("/logout", authMiddleware, ctrl.logout);
usersRouter.get("/current", authMiddleware, ctrl.getCurrentUser);

module.exports = usersRouter;