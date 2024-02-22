const HttpError = require("../helpers/HttpError");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const frappe = require("frappe");
const sendEmail = require("../helpers/sendVerificationEmail");
const { BASE_URL } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const verificationToken = frappe.get_uuid();

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashPassword, verificationToken });

  await sendEmail({
    to: email,
    subject: "Email Verification",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click tp verify your email</a>`,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password invalid");
  }

  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) {
    throw new HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ message: "No Content" });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatarHandler = async (req, res, next) => {
  const avatarUpload = req.file;
  const user = req.user;

  if (!avatarUpload) {
    throw new HttpError(400, "Avatar file is required");
  }
  
  if (user.avatarURL) {
    await fs.promises.unlink(path.join(__dirname, "..", "public", "avatars", user.avatarURL));
  }

  const avatarFileName = generateUniqueFileName();
  const avatarPath = path.join(__dirname, "..", "tmp", avatarFileName);

  await avatarUpload.mv(avatarPath);

  const newAvatarURL = `avatars/${avatarFileName}`;
  await fs.promises.rename(avatarPath, path.join(__dirname, "..", "public", newAvatarURL));

  user.avatarURL = newAvatarURL;
  await user.save();

  res.json({ avatarURL: newAvatarURL });
};
const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await sendEmail({
    to: user.email,
    subject: "Email Verification",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email</a>`,
  });

  res.status(200).json({ message: "Verification email sent" });
};


module.exports = {
  registerUser: controllerWrapper(registerUser),
  loginUser: controllerWrapper(loginUser),
  logout: controllerWrapper(logout),
  getCurrentUser: controllerWrapper(getCurrentUser),
  updateUserAvatar: controllerWrapper(updateAvatarHandler),
  resendVerificationEmail: controllerWrapper(resendVerificationEmail),
};