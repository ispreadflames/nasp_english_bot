const { Scenes } = require('telegraf');
const { message } = require('telegraf/filters');
const { userServices } = require('../services');
const { userController } = require('../controllers');
const { getFileUrl } = require('../lib/utils');
const cloudinary = require('../config/cloudinary');
const { getAdminTelegramIds } = require('../services/admin.service');
const date = require('date-fns');

const firstNameScene = new Scenes.BaseScene('firstName');
const lastNameScene = new Scenes.BaseScene('lastName');
const imageScene = new Scenes.BaseScene('image');

imageScene.enter((ctx) => {
  ctx.reply(ctx.i18n.t('user.send_screenshot'), {
    reply_markup: {
      keyboard: [[{ text: ctx.i18n.t('user.cancel') }]],
    },
  });
});

imageScene.on(message('photo'), async (ctx) => {
  const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  const { fileUrl, file_size } = await getFileUrl(ctx, fileId);
  ctx.reply('Uploading image...');
  const { url } = await cloudinary.uploader.upload(fileUrl);

  ctx.session.imageUrl = url;

  ctx.scene.enter('firstName');
});

firstNameScene.enter((ctx) => {
  ctx.reply('Send me your first name');
});

firstNameScene.on(message('text'), (ctx) => {
  ctx.session.firstName = ctx.message.text;
  ctx.scene.enter('lastName');
});

lastNameScene.enter((ctx) => {
  ctx.reply('Send me your last name');
});

lastNameScene.on(message('text'), async (ctx) => {
  ctx.session.lastName = ctx.message.text;

  const { firstName, lastName, imageUrl } = ctx.session;

  const user = await userServices.savePayment(
    imageUrl,
    firstName,
    ctx.from.id,
    ctx.from.username,
    lastName,
  );

  const admins = await getAdminTelegramIds();

  const paidAt = new Date(user.createdAt);

  for (const admin of admins) {
    const caption = `Name: ${firstName} ${lastName} \nUsername: @${
      ctx.from.username
    } \nTelegramId: ${ctx.from.id} \n PaidAt: ${date.format(
      new Date(paidAt),
      'yyyy-MM-dd HH:mm:ss',
    )}`;

    ctx.telegram.sendPhoto(admin.telegramId, url, {
      caption,
    });
  }

  ctx.scene.leave();

  ctx.reply('Thank you for your payment, we will get back to you soon!');
});

module.exports = {
  firstNameScene,
  lastNameScene,
  imageScene,
};
