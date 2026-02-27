import { asyncHandler } from '../utils/asyncHandler.js';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email, password, and name',
    });
  }

  const user = await registerUser(email, password, name);
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    },
    message: 'User registered successfully',
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password',
    });
  }

  const user = await loginUser(email, password);
  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    },
    message: 'Login successful',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});
