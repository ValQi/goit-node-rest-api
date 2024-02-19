const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');

const generateUniqueFileName = () => {
  const uniqueSuffix = uuidv4();
  return `${Date.now()}-${uniqueSuffix}.jpg`;
};

const resizeAvatar = async (avatarPath) => {
  const image = await Jimp.read(avatarPath);
  await image.cover(250, 250).quality(90).writeAsync(avatarPath);
};

module.exports = {
  generateUniqueFileName,
  resizeAvatar,
};