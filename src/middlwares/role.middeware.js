const { userServices } = require('../services/index');
const { ROLES } = require('../lib/constants');

module.exports = () => {
  return async (ctx, next) => {
    ctx.session = ctx.session || {};
    ctx.session.isBlocked = false;
    const userTelegramId = ctx.from.id;
    const user = await userServices.getUserByTelegramId(userTelegramId);

    if (user) {
      ctx.session.userId = user._id;
      if (user.role === ROLES.admin) {
        ctx.session.isAdmin = true;
      } else {
        ctx.session.isAdmin = false;
      }
    } else {
      ctx.session.isAdmin = false;
    }
    return next();
  };
};
