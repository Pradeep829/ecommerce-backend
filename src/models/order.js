const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerInfo: {
    fullName: String,
    email: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  productDetails: {
    id: String,
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    selectedVariant: {
      type: String, // e.g., "color: black", "size: us7"
      value: String,
      code: String
    },
    quantity: Number,
    subtotal: Number
  },
  total: { type: Number, required: true },
  transactionStatus: {
    type: String,
    enum: ['approved', 'declined', 'gateway_error'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);