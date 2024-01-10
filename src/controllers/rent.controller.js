/**
 * @typedef {import('telegraf').Context} Context
 */

/**
 *
 * @param {Context} ctx
 */
const onListRents = (ctx) => {
  ctx.reply('List Rents');
};

/**
 *
 * @param {Context} ctx
 */
const onNewRent = (ctx) => {
  ctx.reply('New Rents');
};

/**
 *
 * @param {Context} ctx
 */
const onContactUs = (ctx) => {
  ctx.reply('Contact us');
};

module.exports = {
  onListRents,
  onNewRent,
  onContactUs,
};
