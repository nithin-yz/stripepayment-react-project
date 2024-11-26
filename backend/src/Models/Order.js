const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cart: { type: Array, required: true },
  customer: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
