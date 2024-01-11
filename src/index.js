const config = require('./config/config');
const bot = require('./lib/bot');
const { startActions, userActions, adminActions } = require('./actions');
require('./config/db');

startActions();
userActions();
adminActions();

const production = () => {
  console.log('Bot runs in production mode');
  console.log(`${config.username} setting webhook: ${config.webHook}`);
  bot.telegram.setWebhook(config.webHook);
  console.log(`${config.username} starting webhook on port: ${config.port}`);
};

const development = () => {
  console.log('Bot runs in development mode');
  console.log(`${config.username} deleting webhook`);
  bot.telegram.deleteWebhook();
  console.log(`${config.username} starting polling`);
  bot.launch();
};

config.env === 'production' ? production() : development();
