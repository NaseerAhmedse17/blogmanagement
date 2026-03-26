const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokens');

/**
 * POST /api/auth/register
 * Register a new user. Returns user info + token pair.
 */
const register = async (req, res, next) => {
  try {
    console.log('──────────────────────────────────────');
    console.log('[REGISTER] API hit at:', new Date().toISOString());
    console.log('[REGISTER] Body received:', {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password ? '******' : 'MISSING',
      role: req.body.role,
    });
    console.log('──────────────────────────────────────');

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[REGISTER] FAILED - Email already registered:', email);
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.log('[REGISTER] Email is new, creating user...');
    const user = await User.create({ name, email, password, role });
    console.log('[REGISTER] User created successfully - ID:', user._id, '| Role:', user.role);

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Store refresh token hash for future validation / revocation
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    res.status(201).json({
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user credentials and return token pair.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password field (excluded by default)
    const user = await User.findOne({ email }).select('+password +refreshTokens');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Append new refresh token (allows multiple devices)
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await user.save({ validateBeforeSave: false });

    res.json({
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Exchange a valid refresh token for a new access + refresh token pair.
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Verify the token exists in the user's stored tokens (rotation check)
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token reuse detected or invalid' });
    }

    // Rotate: remove old, issue new
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);

    user.refreshTokens = user.refreshTokens
      .filter((t) => t !== refreshToken)
      .concat(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Invalidate the supplied refresh token.
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove this specific refresh token so it can't be reused
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: refreshToken },
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 */
const getMe = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};

module.exports = { register, login, refresh, logout, getMe };
