const db = require('../config/db');

const getProfile = async (userId) => {
  const [rows] = await db.query(
    `SELECT u.id, u.full_name AS username, u.email, u.status, u.created_at AS createdAt,
            GROUP_CONCAT(r.name) AS roles
     FROM users u
     LEFT JOIN user_role ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId]
  );
  if (!rows[0]) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const user = rows[0];
  user.role = user.roles ? user.roles.split(',')[0].trim() : 'user';
  return user;
};

const getAllUsers = async () => {
  const [rows] = await db.query(
    `SELECT u.id, u.full_name AS username, u.email, u.status, u.created_at AS createdAt,
            GROUP_CONCAT(r.name) AS roles
     FROM users u
     LEFT JOIN user_role ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map(u => ({
    ...u,
    role: u.roles ? u.roles.split(',')[0].trim() : 'user',
  }));
};

const updateStatus = async (userId, status) => {
  const allowed = ['active', 'inactive'];
  if (!allowed.includes(status)) {
    const err = new Error(`Status must be one of: ${allowed.join(', ')}`);
    err.status = 400;
    throw err;
  }
  await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
  return { id: userId, status };
};

module.exports = { getProfile, getAllUsers, updateStatus };