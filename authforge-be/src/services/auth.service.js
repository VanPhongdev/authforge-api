const bcrypt = require('bcryptjs');
const db = require('../config/db');
const tokenService = require('./token.service');

const register = async ({ username, full_name, email, password }) => {
  const name = full_name || username;

  // 1. Kiểm tra email tồn tại chưa
  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Insert user — bảng users có cột: full_name, email, password
  const [result] = await db.query(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  // 4. Gán role mặc định "user"
  await db.query(
    'INSERT INTO user_role (user_id, role_id) SELECT ?, id FROM roles WHERE name = "user"',
    [result.insertId]
  );

  return { id: result.insertId, email, username: name };
};

const login = async ({ email, password }) => {
  // 1. Tìm user kèm roles
  const [rows] = await db.query(
    `SELECT u.*, GROUP_CONCAT(r.name) AS roles
     FROM users u
     LEFT JOIN user_role ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     WHERE u.email = ?
     GROUP BY u.id`,
    [email]
  );

  const user = rows[0];
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  // 2. So sánh password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  // 3. Lấy role đầu tiên
  const role = user.roles ? user.roles.split(',')[0].trim() : 'user';

  // 4. Tạo token pair
  const payload = { id: user.id, email: user.email, role, roles: user.roles };
  const accessToken = tokenService.generateAccessToken(payload);
  const refreshToken = await tokenService.generateRefreshToken(payload, user.id);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.full_name, role, roles: user.roles, status: user.status }
  };
};

module.exports = { register, login };