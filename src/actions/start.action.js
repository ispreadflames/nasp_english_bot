const { userController } = require('../controllers');
const bot = require('../lib/bot');

module.exports = () => {
  bot.command('start', userController.onBotStart);
};
