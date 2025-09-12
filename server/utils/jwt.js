import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Decode JWT token without verification (for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};

// Generate token response
export const generateTokenResponse = (user, res) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Set token in cookie
  res.cookie('token', token, cookieOptions);

  return {
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified
    }
  };
};

// Clear token cookie
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};
