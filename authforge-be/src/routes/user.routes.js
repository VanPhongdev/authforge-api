const router = require('express').Router();
const verifyToken = require('../middlewares/auth.middleware');
const checkRole   = require('../middlewares/rbac.middleware');
const { getProfile, getAllUsers, updateStatus } = require('../controllers/user.controller');

// Mọi user đã login đều xem được profile của mình
router.get('/profile', verifyToken, getProfile);

// Chỉ admin mới được dùng 2 route dưới
router.get('/',              verifyToken, checkRole('admin'), getAllUsers);
router.patch('/:id/status',  verifyToken, checkRole('admin'), updateStatus);

module.exports = router;