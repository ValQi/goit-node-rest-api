const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});
const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;