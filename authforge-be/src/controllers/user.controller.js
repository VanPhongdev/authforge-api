const userService = require('../services/user.service');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const result = await userService.updateStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (err) { next(err); }
};

module.exports = { getProfile, getAllUsers, updateStatus };