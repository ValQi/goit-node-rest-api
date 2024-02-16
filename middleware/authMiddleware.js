const jwt = require('jsonwebtoken');
const User = require('../models/Users');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (!token) {
      throw { status: 401, message: 'Not authorized' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.token !== token) {
      throw { status: 401, message: 'Not authorized' };
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(error.status || 401).json({ message: error.message || 'Not authorized' });
  }
}

module.exports = authenticateToken;