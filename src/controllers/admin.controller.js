/**
 * @typedef {import('telegraf').Context} Context
 */

const { composePayment, composeStatistics } = require('../lib/utils');
const { adminServices } = require('../services');

/**
 * get payments.
 * @param {Context} ctx - The Telegraf context.
 */

const onGetPayments = async (ctx) => {
  const payments = await adminServices.getPayments();
  for (const payment of payments) {
    await composePayment(
      payment.imageUrl,
      payment.name,
      payment.telegramId,
      payment.username,
      payment.createdAt,
      ctx,
    );
  }
};

/**
 * get payments.
 * @param {Context} ctx - The Telegraf context.
 */
const onGetStatistics = async (ctx) => {
  ctx.reply('Get Statistics');
  const {
    paymentsCount,
    estimatedPayment,
    paymentsToday,
    paymentsThisWeek,
    paymentsThisMonth,
  } = await adminServices.getStatistics();
  composeStatistics(
    paymentsCount,
    estimatedPayment,
    paymentsToday,
    paymentsThisWeek,
    paymentsThisMonth,
    ctx,
  );
};

module.exports = {
  onGetPayments,
  onGetStatistics,
};
