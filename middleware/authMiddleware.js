const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const HttpError = require('../helpers/HttpError');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      throw new HttpError(401, 'Not authorized');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.token !== token) {
      throw new HttpError(401, 'Not authorized');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticateToken;