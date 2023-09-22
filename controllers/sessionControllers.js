import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/v1/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken(user._id, process.env.JWT_SECRET, '1d');
    const session = await Session.create({ token, user });

    if (session) {
      return res.status(201).json({
        token,
      });
    }

    res.status(401);
    throw new Error('Cannot create session right now, try after sometime');
  }

  res.status(401);
  throw new Error('Invalid user data!!');
});

// @desc    Auth user and get token
// @route   POST /api/v1/users/login
// @access  public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, process.env.JWT_SECRET, '1d');
    const session = await Session.create({ token, user });

    if (session) {
      return res.status(201).json({
        token,
      });
    }

    res.status(401);
    throw new Error('Cannot create session right now, try after sometime');
  }

  res.status(401);
  throw new Error('Invalid credentials!!');
});

// @desc    Mark session as inactive
// @route   POST /api/v1/users/logout
// @access  protect
const logoutUser = asyncHandler(async (req, res) => {
  let session = req.session;
  session.isActive = false;
  await session.save();

  res.json({ msg: 'Logged out successfully!!!' });
});

export { registerUser, authUser, logoutUser };
