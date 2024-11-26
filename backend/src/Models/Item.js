const mongoose = require('mongoose');

// Define a schema for the products
const ItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true }
});

// Create a model from the schema
module.exports = mongoose.model('Product', ItemSchema);  // Renamed to 'Product' for clarity
