const { Scenes } = require('telegraf');
const { message } = require('telegraf/filters');
const { userValidator } = require('../validators');
const validate = require('../lib/validate');
const { userController } = require('../controllers');
const bot = require('../lib/bot');

const firstNameScene = new Scenes.BaseScene('firstName');
const lastNameScene = new Scenes.BaseScene('lastName');
const emailScene = new Scenes.BaseScene('email');
const contactScene = new Scenes.BaseScene('contact');
const sexScene = new Scenes.BaseScene('sex');

const cancelMarkup = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Cancel', callback_data: 'cancel_registration' }],
    ],
  },
};

firstNameScene.enter((ctx) => {
  ctx.reply('Please enter your name:', cancelMarkup);
});

firstNameScene.on(message('text'), (ctx) => {
  const firstName = ctx.message.text;
  if (
    !validate({
      ctx,
      message: 'Invalid name. Please enter a name between 3 and 15 characters.',
      validator: userValidator.firstName,
      value: firstName,
    })
  )
    return;
  ctx.session.firstName = firstName;
  ctx.scene.enter('lastName');
});

lastNameScene.enter((ctx) => {
  ctx.reply('Please enter your last name:');
});

lastNameScene.on(message('text'), (ctx) => {
  const lastName = ctx.message.text;
  if (
    !validate({
      ctx,
      message:
        'Invalid First name. Please enter a name between 3 and 15 characters.',
      validator: userValidator.lastName,
      value: lastName,
    })
  )
    return;
  ctx.session.lastName = lastName;
  ctx.scene.enter('email');
});

emailScene.enter((ctx) => {
  ctx.reply('Enter your email (optional)', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Skip', callback_data: 'skip_email' }]],
      resize_keyboard: true,
    },
  });
});

emailScene.on(message('text'), (ctx) => {
  const email = ctx.message.text;
  if (
    !validate({
      ctx,
      message: 'Invalid email. Please enter a valid email.',
      validator: userValidator.email,
      value: email,
    })
  )
    return;
  ctx.session.email = email;
  ctx.scene.enter('sex');
});

sexScene.enter((ctx) => {
  ctx.reply('Choose your sex', {
    reply_markup: {
      keyboard: [[{ text: 'Male' }, { text: 'Female' }]],
      resize_keyboard: true,
    },
  });
});

sexScene.on(message('text'), (ctx) => {
  const sex = ctx.message.text;
  if (
    !validate({
      ctx,
      message: 'Invalid sex. Please choose male or female.',
      validator: userValidator.sex,
      value: sex,
    })
  )
    return;
  ctx.session.sex = sex;
  ctx.scene.enter('contact');
});

contactScene.enter((ctx) => {
  ctx.reply('Please share your contact Information', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Share Contact',
            request_contact: true,
          },
        ],
      ],
      resize_keyboard: true,
    },
  });
});

contactScene.on(message('contact'), async (ctx) => {
  const contactInfo = ctx.message.contact;
  ctx.session.contactInfo = contactInfo;
  ctx.scene.leave();
  const {
    firstName,
    lastName,
    email,
    contactInfo: { phone_number },
  } = ctx.session;
  await userController.onSaveUser({
    firstName,
    lastName,
    phoneNumber: phone_number,
    telegramId: ctx.from.id,
    email,
  });
  ctx.reply('Registration completed!', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Main Menu', callback_data: 'main_menu' }]],
    },
  });
});

module.exports = {
  firstNameScene,
  lastNameScene,
  emailScene,
  contactScene,
  sexScene,
};
