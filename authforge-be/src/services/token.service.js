const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });
};

const generateRefreshToken = async (payload, userId) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

  // Bảng refresh_token lưu raw token (không hash)
  // Lưu ý: token varchar(255) có thể không đủ dài cho JWT → dùng TEXT nếu bị lỗi
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.query(
    'INSERT INTO refresh_token (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );

  return token;
};

const verifyRefreshToken = async (token) => {
  // 1. Verify signature
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  // 2. Tìm token trong DB — bảng refresh_token, so sánh raw token
  const [rows] = await db.query(
    'SELECT * FROM refresh_token WHERE user_id = ? AND token = ? AND is_revoked = 0 AND expires_at > NOW()',
    [decoded.id, token]
  );

  if (rows.length === 0) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  return { decoded, tokenId: rows[0].id };
};

const revokeRefreshToken = async (tokenId) => {
  await db.query('UPDATE refresh_token SET is_revoked = 1 WHERE id = ?', [tokenId]);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken };