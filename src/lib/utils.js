/**
 * @typedef {import('telegraf').Context} Context
 */

const config = require('../config/config');
const date = require('date-fns');
const ApiError = require('./Error');
const { ERROR_TYPES } = require('./constants');

const replyToMessage = (ctx, messageId, string) =>
  ctx.reply(string, {
    reply_to_message_id: messageId,
  });

/**
 * @param {Context} ctx
 */
const getFileUrl = async (ctx, fileId) => {
  const file = await ctx.telegram.getFile(fileId);
  const filePath = file.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${config.botToken}/${filePath}`;
  return { fileUrl, file_size: file.file_size };
};

/**
 * @param {Context} ctx
 */
const composePayment = async (
  imageUrl,
  name,
  telegramId,
  username,
  createdAt,
  ctx,
) => {
  const paidAt = new Date(createdAt);
  ctx.replyWithPhoto(imageUrl, {
    caption: `Name: ${name} \nUsername: @${username} \nTelegramId: ${telegramId} \n PaidAt: ${date.format(
      new Date(paidAt),
      'yyyy-MM-dd HH:mm:ss',
    )}`,
  });
};

/**
 * @param {Context} ctx
 */
const composeStatistics = async (
  paymentsCount,
  estimatedPayment,
  paymentsToday,
  paymentsThisWeek,
  paymentsThisMonth,
  ctx,
) => {
  ctx.replyWithHTML(
    `<b>Payments Count</b>: ${paymentsCount} \n<b>Estimated Payment</b>: ${estimatedPayment}ETB \n<b>Payments Today</b>: ${paymentsToday} \n<b>Payments This Week</b>: ${paymentsThisWeek} \n<b>Payments This Month</b>: ${paymentsThisMonth}`,
  );
};

const authorize = (ctx, adminOnly = false) => {
  if (adminOnly) {
    if (!ctx.session.isAdmin) {
      throw new ApiError(
        ctx.i18n.t('errors.un_authorized'),
        ERROR_TYPES.un_authorized,
      );
    }
  }
};

module.exports = {
  replyToMessage,
  getFileUrl,
  composePayment,
  composeStatistics,
  authorize,
};
