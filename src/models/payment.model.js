const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
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
  telegramId: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
