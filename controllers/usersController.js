const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.token = token;
    await user.save();

    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

const getCurrentUser = (req, res) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription
  });
};

const logout = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { token: null });
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};
module.exports = {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  getCurrentUser: controllerWrapper(getCurrentUser),
  logout: controllerWrapper(logout)
};