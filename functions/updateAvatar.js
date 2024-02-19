const HttpError = require("../helpers/HttpError");
const User = require("../models/Users.js");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const { generateUniqueFileName, resizeAvatar } = require("../helpers/avatarUtils");
const controllerWrapper = require("../helpers/controllerWrapper");

const updateAvatar = async (req, res, next) => {
  const avatarUpload = req.file;
  if (!avatarUpload) {
    throw new HttpError(400, "Avatar file is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (user.avatarURL) {
    fs.unlinkSync(path.join(__dirname, "..", "public", "avatars", user.avatarURL));
  }

  const avatarFileName = generateUniqueFileName();
  const avatarPath = path.join(__dirname, "..", "tmp", avatarFileName);

  await promisify(avatarUpload.mv)(avatarPath);

  await resizeAvatar(avatarPath);

  const newAvatarURL = `avatars/${avatarFileName}`;
  fs.renameSync(avatarPath, path.join(__dirname, "..", "public", newAvatarURL));

  user.avatarURL = newAvatarURL;
  await user.save();

  res.json({ avatarURL: newAvatarURL });
};

module.exports = {
  updateAvatar: controllerWrapper(updateAvatar),
};