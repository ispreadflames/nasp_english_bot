const { Payment, User } = require('../models');
const date = require('date-fns');

const getStatistics = async () => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: null,
        paymentsCount: {
          $sum: 1,
        },
        estimatedPayment: {
          $sum: 500,
        },
        paymentsToday: {
          $sum: {
            $cond: [
              {
                $gte: ['$createdAt', date.getDate(new Date())],
              },
              1,
              0,
            ],
          },
        },
        paymentsThisWeek: {
          $sum: {
            $cond: [
              {
                $gte: ['$createdAt', date.getWeek(new Date())],
              },
              1,
              0,
            ],
          },
        },
        paymentsThisMonth: {
          $sum: {
            $cond: [
              {
                $gte: ['$createdAt', date.getMonth(new Date())],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);
  return stats[0];
};

const getPayments = () => {
  return Payment.find({}).sort({ createdAt: -1 });
};

/**
 * Retrieves the Telegram IDs of all admin users.
 *
 * @return {Promise<Array>} An array of admin user Telegram IDs.
 */
const getAdminTelegramIds = async () => {
  const admins = await User.find({}).select('telegramId');
  return admins;
};

module.exports = {
  getStatistics,
  getPayments,
  getAdminTelegramIds,
};
