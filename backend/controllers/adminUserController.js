const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MAX_SEARCH_LENGTH = 100;


// @desc    Get admin users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
  try {
    const { q, role, status } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.isActive = status === 'active';
    }

    if (q) {
      const safeQuery = q.trim().slice(0, MAX_SEARCH_LENGTH);
      if (safeQuery) {
        const regex = new RegExp(escapeRegex(safeQuery), 'i');
        filter.$or = [{ name: regex }, { email: regex }];
      }
    }

    const [users, stats] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .select('-password'),
      User.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            admins: {
              $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
            },
            superadmins: {
              $sum: { $cond: [{ $eq: ['$role', 'superadmin'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const statsEntry = stats[0] || { total: 0, active: 0, admins: 0, superadmins: 0 };

    res.json({
      success: true,
      data: {
        users,
        stats: {
          total: statsEntry.total,
          active: statsEntry.active,
          inactive: statsEntry.total - statsEntry.active,
          admins: statsEntry.admins,
          superadmins: statsEntry.superadmins
        }
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load admin users'
    });
  }
};

// @desc    Update admin user role/status
// @route   PATCH /api/admin/users/:id
// @access  Private/SuperAdmin
const updateAdminUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const allowedRoles = ['admin', 'superadmin'];
    const updates = {};

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role provided'
        });
      }
      updates.role = role;
    }

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updates provided'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUserId = req.user?.id?.toString() || req.user?._id?.toString();
    if (user._id.toString() === currentUserId) {
      if (updates.role && updates.role !== user.role) {
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

    Object.assign(user, updates);
    await user.save();

    const sanitized = user.toObject();
    delete sanitized.password;

    res.json({
      success: true,
      data: sanitized
    });
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin user'
    });
  }
};

module.exports = {
  getAdminUsers,
  updateAdminUser
};
