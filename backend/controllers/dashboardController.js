const Contact = require('../models/Contact');
const Consultation = require('../models/Consultation');
const User = require('../models/User');

// @desc    Get dashboard overview stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel
    const [
      // Contacts stats
      totalContacts,
      newContactsToday,
      newContactsThisWeek,
      newContactsThisMonth,
      contactsByStatus,

      // Consultations stats
      totalConsultations,
      upcomingConsultations,
      consultationsToday,
      consultationsThisWeek,
      consultationsByStatus,

      // Recent activity
      recentContacts,
      recentConsultations,

      // Monthly trends (last 6 months)
      monthlyContacts,
      monthlyConsultations
    ] = await Promise.all([
      // Contacts
      Contact.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: today } }),
      Contact.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Contact.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Consultations
      Consultation.countDocuments(),
      Consultation.countDocuments({
        date: { $gte: today },
        status: { $nin: ['cancelled', 'completed'] }
      }),
      Consultation.countDocuments({
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        status: { $nin: ['cancelled'] }
      }),
      Consultation.countDocuments({
        date: { $gte: today, $lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
        status: { $nin: ['cancelled'] }
      }),
      Consultation.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Recent activity
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName projectType status createdAt'),
      
      Consultation.find()
        .sort({ date: 1 })
        .limit(5)
        .select('name topic date time status'),

      // Monthly trends
      Contact.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ]),

      Consultation.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ])
    ]);

    // Format status counts
    const formatStatusCounts = (arr) => {
      return arr.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
    };

    // Format monthly data
    const formatMonthlyData = (arr) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return arr.map(item => ({
        month: months[item._id.month - 1],
        year: item._id.year,
        count: item.count
      })).reverse();
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalContacts,
          totalConsultations,
          newContactsToday,
          newContactsThisWeek,
          upcomingConsultations,
          consultationsToday
        },
        contacts: {
          byStatus: formatStatusCounts(contactsByStatus),
          thisMonth: newContactsThisMonth,
          trend: formatMonthlyData(monthlyContacts)
        },
        consultations: {
          byStatus: formatStatusCounts(consultationsByStatus),
          thisWeek: consultationsThisWeek,
          trend: formatMonthlyData(monthlyConsultations)
        },
        recentActivity: {
          contacts: recentContacts,
          consultations: recentConsultations
        }
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return next(error);
  }
};

// @desc    Get activity feed
// @route   GET /api/admin/activity
// @access  Private/Admin
const getActivityFeed = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get both contacts and consultations, merge and sort
    const [contacts, consultations] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .select('fullName projectType status createdAt')
        .lean(),
      
      Consultation.find()
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .select('name topic date time status createdAt')
        .lean()
    ]);

    // Format and merge
    const activities = [
      ...contacts.map(c => ({
        type: 'contact',
        title: `New contact from ${c.fullName}`,
        subtitle: c.projectType || 'General inquiry',
        status: c.status,
        date: c.createdAt,
        id: c._id
      })),
      ...consultations.map(c => ({
        type: 'consultation',
        title: `Consultation booked by ${c.name}`,
        subtitle: c.topic,
        status: c.status,
        date: c.createdAt,
        scheduledDate: c.date,
        scheduledTime: c.time,
        id: c._id
      }))
    ];

    // Sort by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    const paginated = activities.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / Number(limit))
      }
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Get project types analytics
// @route   GET /api/admin/analytics/projects
// @access  Private/Admin
const getProjectAnalytics = async (req, res, next) => {
  try {
    const projectTypes = await Contact.aggregate([
      {
        $match: {
          projectType: { $ne: '' }
        }
      },
      {
        $group: {
          _id: '$projectType',
          count: { $sum: 1 },
          avgResponseTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const databases = await Contact.aggregate([
      {
        $match: {
          database: { $ne: '' }
        }
      },
      {
        $group: {
          _id: '$database',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const durations = await Contact.aggregate([
      {
        $match: {
          duration: { $ne: '' }
        }
      },
      {
        $group: {
          _id: '$duration',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        projectTypes,
        databases,
        durations
      }
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Get consultation analytics
// @route   GET /api/admin/analytics/consultations
// @access  Private/Admin
const getConsultationAnalytics = async (req, res, next) => {
  try {
    // Consultations by topic
    const byTopic = await Consultation.aggregate([
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Consultations by type (video/phone/chat)
    const byType = await Consultation.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Conversion rate (confirmed vs total)
    const conversionStats = await Consultation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Popular time slots
    const popularTimes = await Consultation.aggregate([
      {
        $group: {
          _id: '$time',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        byTopic,
        byType,
        conversion: conversionStats[0] || { total: 0, confirmed: 0, completed: 0 },
        popularTimes
      }
    });

  } catch (error) {
    return next(error);
  }
};

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private/Admin
const exportData = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { format = 'json', startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    let data;
    let filename;

    if (type === 'contacts') {
      data = await Contact.find(dateFilter)
        .sort({ createdAt: -1 })
        .select('-__v -ipAddress -userAgent');
      filename = `contacts_export_${new Date().toISOString().split('T')[0]}`;
    } else if (type === 'consultations') {
      data = await Consultation.find(dateFilter)
        .sort({ createdAt: -1 })
        .select('-__v -ipAddress');
      filename = `consultations_export_${new Date().toISOString().split('T')[0]}`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid export type'
      });
    }

    if (format === 'csv') {
      // Simple CSV conversion
      const headers = Object.keys(data[0]?.toObject() || {}).join(',');
      const rows = data.map(item => Object.values(item.toObject()).join(','));
      const csv = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csv);
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivityFeed,
  getProjectAnalytics,
  getConsultationAnalytics,
  exportData
};
