/**
 * seed-admin.js
 * Tạo tài khoản admin mặc định cho AuthForge
 * Chạy: node seed-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const ADMIN_EMAIL = 'admin@authforge.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Administrator';

async function seed() {
  try {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // 2. Kiểm tra email đã tồn tại chưa
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
    if (existing.length > 0) {
      process.exit(0);
    }

    // 3. Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password, full_name, status) VALUES (?, ?, ?, ?)',
      [ADMIN_EMAIL, hashedPassword, ADMIN_NAME, 'active']
    );
    const adminId = result.insertId;
    console.log('Đã tạo user:', ADMIN_EMAIL, '(id:', adminId + ')');

    // 4. Kiểm tra role admin có tồn tại không
    const [roles] = await db.query('SELECT id FROM roles WHERE name = "admin"');
    if (roles.length === 0) {
      // Tự động tạo roles nếu chưa có
      await db.query(
        'INSERT IGNORE INTO roles (name, description) VALUES (?, ?), (?, ?)',
        ['admin', 'Administrator - toàn quyền hệ thống', 'user', 'User - người dùng thường']
      );
      console.log('Đã tạo roles: admin, user');
    }

    // 5. Gán role admin
    await db.query(
      'INSERT INTO user_role (user_id, role_id) SELECT ?, id FROM roles WHERE name = "admin"',
      [adminId]
    );
    console.log('Đã gán role admin\n');

    console.log('─'.repeat(40));
    console.log('Seed thành công!');
    console.log('Email   :', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('─'.repeat(40));

    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  }
}

seed();
