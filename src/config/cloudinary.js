const config = require('../config/config');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

module.exports = cloudinary;
