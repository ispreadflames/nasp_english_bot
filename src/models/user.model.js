const mongoose = require('mongoose');
const { ROLES, SEX, LANGUAGES } = require('../lib/constants');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  telegramId: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.user,
  },
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    default: LANGUAGES.en,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
