import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Get token expiration date
 * @returns {Date} Expiration date
 */
export const getTokenExpiration = () => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const days = parseInt(expiresIn) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};
