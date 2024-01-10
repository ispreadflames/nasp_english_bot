const { userServices } = require('../services');

module.exports = (defaultLanguage) => {
  return async (ctx, next) => {
    const lang = await userServices.getUserLangPreferences(ctx.from.id);
    if (lang) {
      ctx.i18n.locale(lang);
    } else {
      ctx.i18n.locale(defaultLanguage);
    }

    return next();
  };
};
