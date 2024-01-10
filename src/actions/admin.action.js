const bot = require('../lib/bot');
const { userController, adminController } = require('../controllers');
const { match } = require('telegraf-i18n');
const { message } = require('telegraf/filters');

module.exports = () => {
  bot.hears(match('admin.payments'), adminController.onGetPayments);
  bot.hears(match('admin.statistics'), adminController.onGetStatistics);
};
