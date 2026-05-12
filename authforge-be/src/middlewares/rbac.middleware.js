const checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Hỗ trợ cả 2 trường hợp:
  // 1. role: "admin" (string đơn)
  // 2. roles: "admin,user" (string nhiều role)
  let userRoles = [];

  if (req.user.role) {
    userRoles.push(req.user.role.trim());
  }

  if (req.user.roles) {
    const fromRoles = req.user.roles.split(',').map(r => r.trim());
    userRoles = [...new Set([...userRoles, ...fromRoles])];
  }

  const hasRole = allowedRoles.some(role => userRoles.includes(role));
  if (!hasRole) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }

  next();
};

module.exports = checkRole;