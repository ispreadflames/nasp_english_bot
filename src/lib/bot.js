const { Telegraf, session } = require('telegraf');
const config = require('../config/config');
const Stages = require('../stages');
const TelegrafI18n = require('telegraf-i18n');
const path = require('path');
const {
  setDefaultLanguage,
  authMiddeware,
  roleMiddleware,
} = require('../middlwares');
const { LANGUAGES, ERROR_TYPES } = require('./constants');

const bot = new Telegraf(config.botToken);

const defaultLanguage = LANGUAGES.en;

const i18n = new TelegrafI18n({
  defaultLanguage,
  allowMissing: false,
  directory: path.resolve(__dirname, '../', 'locales'),
  useSession: true,
});

bot.use(session());
bot.use(Stages.middleware());
bot.use(i18n.middleware());
bot.use(setDefaultLanguage(defaultLanguage));
bot.use(roleMiddleware());
bot.use(authMiddeware());
bot.catch((error, ctx) => {
  switch (error.type) {
    case ERROR_TYPES.un_authorized:
      return ctx.reply(error.message);
    default:
      ctx.reply('Something went wrong!');
  }
});

module.exports = bot;
