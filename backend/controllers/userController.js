const mongoose = require('mongoose');
const User = require('../models/User');

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
};

const isUserEditingSelf = (userId, paramId) => String(userId) === paramId;

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/SuperAdmin
const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const { role, isActive } = req.body;
    const updates = {};

    if (role !== undefined) {
      if (!['admin', 'superadmin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role provided'
        });
      }
      updates.role = role;
    }

    if (isActive !== undefined) {
      const normalized = normalizeBoolean(isActive);
      if (normalized === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      updates.isActive = normalized;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }

    if (isUserEditingSelf(req.user.id, req.params.id)) {
      if (updates.role && updates.role !== req.user.role) {
        return res.status(400).json({
          success: false,
          message: 'You cannot change your own role'
        });
      }
      if (updates.isActive === false) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own account'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

module.exports = {
  getUsers,
  updateUser
};
