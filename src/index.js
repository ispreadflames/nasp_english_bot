const createDebug = require('debug');
const config = require('./config/config');
const bot = require('./lib/bot');
const { startActions, userActions, adminActions } = require('./actions');
require('./config/db');

const debug = createDebug('bot');

startActions();
userActions();
adminActions();

const production = () => {
  debug('Bot runs in production mode');
  debug(`${config.username} setting webhook: ${config.webHook}`);
  bot.telegram.setWebhook(config.webHook);
  debug(`${config.username} starting webhook on port: ${config.port}`);
};

const development = () => {
  debug('Bot runs in development mode');
  debug(`${config.username} deleting webhook`);
  bot.telegram.deleteWebhook();
  debug(`${config.username} starting polling`);
  bot.launch();
};

config.env === 'production' ? production() : development();
