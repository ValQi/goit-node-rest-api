const Jimp = require("jimp");

const resizeAvatar = async (avatarPath) => {
  const image = await Jimp.read(avatarPath);
  await image.cover(250, 250).quality(90).writeAsync(avatarPath);
};

module.exports = resizeAvatar;