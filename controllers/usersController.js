const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.token = token;
    await user.save();

    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { registerUser, loginUser };