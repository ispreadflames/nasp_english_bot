const bot = require('../lib/bot');
const { userController } = require('../controllers');
const { match } = require('telegraf-i18n');
const { message } = require('telegraf/filters');

module.exports = () => {
  bot.hears(match('user.registration'), userController.onRegisterUser);
  bot.hears(match('user.cancel'), userController.onBotStart);
  bot.hears(match('user.why_choose_us'), userController.onWhyChooseUs);
  bot.on(message('photo'), userController.onGetScreenShot);
  bot.action('cancel_registration', userController.onCancelRegisteration);
  bot.action('skip_email', userController.onSkipEmail);
  bot.hears(match('user.changeLanguage'), userController.onChangeLanguage);
  bot.action(
    /^(change_lang_en|change_lang_am)$/,
    userController.onChangeUserLanguage,
  );
};
