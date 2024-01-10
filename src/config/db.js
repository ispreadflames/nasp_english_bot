const mongoose = require('mongoose');
const config = require('./config');

mongoose
  .connect(config.mongoUri)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log('database connection error', error));

module.exports = mongoose;
