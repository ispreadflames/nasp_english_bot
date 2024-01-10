const Payment = require('../models/payment.model');
const User = require('../models/user.model');

/**
 * Save a user to the database.
 * @param {Object} user - The user object.
 * @param {string} user.firstName - The first name of the user.
 * @param {string} user.lastName - The last name of the user.
 * @param {string} user.sex - The last name of the user.
 * @param {string} user.phoneNumber - The phone number of the user.
 * @param {string} user.telegramId - The Telegram ID of the user.
 * @returns {Promise<void>} A Promise that resolves when the user is saved to the database.
 */
const saveUserToDB = async (user) => {
  const res = await User.create(user);
};

const getUserByTelegramId = (id) => {
  return User.findOne({ telegramId: id });
};

/**
 * Retrieves the language preferences of a user based on their Telegram ID.
 *
 * @param {number} telegramId - The Telegram ID of the user.
 * @return {string} The language preferences of the user, or null if the user does not exist.
 */
const getUserLangPreferences = async (telegramId) => {
  const user = await getUserByTelegramId(telegramId);
  if (!user) return null;
  return user.language;
};

/**
 * Updates the language preferences of a user.
 *
 * @param {number} id - The Telegram ID of the user.
 * @param {string} lang - The new language preference.
 * @return {Promise<null>} - Returns null if the user is not found.
 */
const changeUserLangPreferences = async (id, lang) => {
  const user = await getUserByTelegramId(id);
  if (!user) return null;
  user.language = lang;
  user.save();
};

/**
 * Saves a payment with the provided image URL, name, and telegram ID.
 *
 * @param {string} imageUrl - The URL of the image associated with the payment.
 * @param {string} name - The name associated with the payment.
 * @param {string} telegramId - The telegram ID associated with the payment.
 * @param {string} username - The telegram ID associated with the payment.
 * @return {Object} - The created Payment object.
 */
const savePayment = (imageUrl, name, telegramId, username) => {
  return Payment.create({ imageUrl, name, telegramId, username });
};

module.exports = {
  saveUserToDB,
  getUserByTelegramId,
  getUserLangPreferences,
  changeUserLangPreferences,
  savePayment,
};
