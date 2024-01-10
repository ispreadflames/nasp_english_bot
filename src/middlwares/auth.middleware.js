const { authorize } = require('../lib/utils');

module.exports = () => {
  return async (ctx, next) => {
    const authorizedCommands = [
      ctx.i18n.t('admin.payments'),
      ctx.i18n.t('admin.statistics'),
    ];
    if (ctx.updateType === 'message' && ctx.update.message.text) {
      if (authorizedCommands.includes(ctx.update.message.text)) {
        authorize(ctx, true);
      }
      authorize(ctx);
    }
    next();
  };
};
