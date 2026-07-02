import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Parse a duration string like '7d', '24h', '30m' into milliseconds.
 * Defaults to 7 days if the format is unrecognised.
 */
const parseDurationMs = (str = '7d') => {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const [, n, unit] = match;
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return parseInt(n) * multipliers[unit];
};

export const getTokenExpiration = () => {
  const ms = parseDurationMs(process.env.JWT_EXPIRES_IN || '7d');
  return new Date(Date.now() + ms);
};
