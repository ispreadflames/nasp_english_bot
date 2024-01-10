const { Scenes } = require('telegraf');
const registerScenes = require('./register.scene');

module.exports = new Scenes.Stage([...Object.values(registerScenes)]);
