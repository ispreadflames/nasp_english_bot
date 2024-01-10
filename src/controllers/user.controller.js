/**
 * @typedef {import('telegraf').Context} Context
 */

const { ROLES, LANGUAGES } = require('../lib/constants');
const { getFileUrl, composePayment } = require('../lib/utils');
const { userServices } = require('../services');
const cloudinary = require('../config/cloudinary');
const { getAdminTelegramIds } = require('../services/admin.service');
const date = require('date-fns');
const config = require('../config/config');

/**
 * start bot handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onBotStart = async (ctx) => {
  const userName = ctx.message?.from.first_name || 'User';
  const user = await userServices.getUserByTelegramId(ctx.from.id);

  if (!user)
    return ctx.replyWithHTML(ctx.i18n.t('greeting.user', { userName }), {
      reply_markup: {
        keyboard: [
          [
            {
              text: ctx.i18n.t('user.requirements'),
            },
          ],
          [
            {
              text: ctx.i18n.t('user.why_choose_us'),
            },
          ],
          [
            {
              text: ctx.i18n.t('user.registration'),
            },
          ],
          [
            {
              text: ctx.i18n.t('user.testimonials'),
            },
          ],
        ],
      },
    });
  else {
    if (user.role === ROLES.user) {
      return ctx.reply(ctx.i18n.t('greeting.loggedIn', { userName }), {
        reply_markup: {
          keyboard: [
            [
              { text: ctx.i18n.t('user.myRents') },
              { text: ctx.i18n.t('user.newRent') },
            ],
            [
              { text: ctx.i18n.t('user.contactUs') },
              { text: ctx.i18n.t('user.changeLanguage') },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }
    if (user.role === ROLES.admin) {
      return ctx.reply(ctx.i18n.t('greeting.admin', { userName }), {
        reply_markup: {
          keyboard: [
            [
              {
                text: ctx.i18n.t('admin.payments'),
              },
            ],
            [
              {
                text: ctx.i18n.t('admin.statistics'),
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }
  }
};

/**
 * Register user handler.
 * @param {Context} ctx - The Telegraf context.
 */

const onRegisterUser = (ctx) => {
  ctx.reply(ctx.i18n.t('user.send_screenshot'), {
    reply_markup: {
      keyboard: [[{ text: ctx.i18n.t('user.cancel') }]],
    },
  });
};

/**
 * Cancel Registeration handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onCancelRegisteration = (ctx) => {
  ctx.scene.leave();
  ctx.reply('Registeration canceled!', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Register',
            callback_data: 'register',
          },
        ],
      ],
    },
  });
  1;
};

/**
 * Saves the user to the database.
 *
 * @param {Object} user - The user object.
 * @param {string} user.firstName - The first name of the user.
 * @param {string} user.lastName - The last name of the user.
 * @param {string} user.phoneNumber - The phone number of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.telegramId - The Telegram ID of the user.
 * @return {Promise} A promise that resolves when the user is saved successfully.
 */
const onSaveUser = async (user) => {
  await userServices.saveUserToDB(user);
};

/**
 * Skip email handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onSkipEmail = async (ctx) => {
  ctx.session.email = undefined;
  ctx.scene.enter('contact');
};

/**
 * Skip email handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onChangeLanguage = async (ctx) => {
  const chooseLanguage = ctx.i18n.t('inst.chooseLanguage');
  ctx.reply(chooseLanguage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇬🇧 English', callback_data: 'change_lang_en' },
          { text: '🇪🇹 አማርኛ', callback_data: 'change_lang_am' },
        ],
      ],
    },
  });
};

/**
 * Skip email handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onChangeUserLanguage = async (ctx) => {
  const action = ctx.callbackQuery.data;

  switch (action) {
    case 'change_lang_en':
      ctx.i18n.locale(LANGUAGES.en);
      await userServices.changeUserLangPreferences(ctx.from.id, LANGUAGES.en);
      onBotStart(ctx);
      break;
    case 'change_lang_am':
      ctx.i18n.locale(LANGUAGES.am);
      await userServices.changeUserLangPreferences(ctx.from.id, LANGUAGES.am);
      onBotStart(ctx);
      break;
  }
};

/**
 * Skip email handler.
 * @param {Context} ctx - The Telegraf context.
 */

const onGetScreenShot = async (ctx) => {
  const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const { fileUrl, file_size } = await getFileUrl(ctx, fileId);
  ctx.reply(ctx.i18n.t('user.uploading_image'));
  const { url } = await cloudinary.uploader.upload(fileUrl);
  const user = await userServices.savePayment(
    url,
    ctx.from.first_name,
    ctx.from.id,
    ctx.from.username,
  );

  const admins = await getAdminTelegramIds();

  const paidAt = new Date(user.createdAt);

  for (const admin of admins) {
    const caption = `Name: ${ctx.from.first_name} \nUsername: @${
      ctx.from.username
    } \nTelegramId: ${ctx.from.id} \n PaidAt: ${date.format(
      new Date(paidAt),
      'yyyy-MM-dd HH:mm:ss',
    )}`;

    ctx.telegram.sendPhoto(admin.telegramId, url, {
      caption,
    });
  }

  ctx.reply(ctx.i18n.t('user.image_uploaded'));
  onBotStart(ctx);
};

/**
 * Cancel Registeration handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onWhyChooseUs = (ctx) => {
  return ctx.replyWithHTML(ctx.i18n.t('user.why_choose_us_details'));
};

/**
 * Cancel Registeration handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onRequirmentDetails = (ctx) => {
  return ctx.replyWithHTML(ctx.i18n.t('user.requirements_details'));
};

/**
 * Cancel Registeration handler.
 * @param {Context} ctx - The Telegraf context.
 */
const onGetTestimonials = async (ctx) => {
  await ctx.replyWithHTML(ctx.i18n.t('user.testimonials_details'));
  await ctx.telegram.forwardMessage(ctx.chat.id, config.channelId, '26');
  await ctx.telegram.forwardMessage(ctx.chat.id, config.channelId, '27');
  await ctx.telegram.forwardMessage(ctx.chat.id, config.channelId, '28');
  await ctx.telegram.forwardMessage(ctx.chat.id, config.channelId, '29');
};

module.exports = {
  onBotStart,
  onRegisterUser,
  onSaveUser,
  onCancelRegisteration,
  onSkipEmail,
  onChangeLanguage,
  onChangeUserLanguage,
  onGetScreenShot,
  onWhyChooseUs,
  onRequirmentDetails,
  onGetTestimonials,
};
