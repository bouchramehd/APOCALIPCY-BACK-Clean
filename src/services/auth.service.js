const User = require('../models/User');

async function register({ username, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({ username, email, password });
  await newUser.save();
  return newUser;
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  return user; 
}

module.exports = {
  register,
  login
};
