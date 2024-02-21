const resizeAvatarMiddleware = async (req, res, next) => {
    const avatarPath = req.file.path;
    try {
      const image = await Jimp.read(avatarPath);
      await image.cover(250, 250).quality(90).writeAsync(avatarPath);
      next(); 
    } catch (error) {
      next(error); 
    }
  };
  
  module.exports = resizeAvatarMiddleware;