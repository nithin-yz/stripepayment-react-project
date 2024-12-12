const mongoose = require('mongoose');
const path = require('path'); // Path module to resolve file path
const fs = require('fs'); // File system module to read files
const Product = require('./src/Models/Item'); // Import the Product model

// MongoDB connection URL
const uri = 'mongodb+srv://tomshift22:hmIIGiOuw7v8zKNe@bestbuy.zxclmeg.mongodb.net/ShoppingApp?retryWrites=true&w=majority&appName=Bestbuy';


const productsPath = path.join(__dirname, 'productdatas.json');

//here i welcome all
console.log(productsPath)

// Read and parse the products data from the JSON file
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
// console.log(products)
// // Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB!');
    return Product.insertMany(products);  // Insert the data into the 'products' collection
  })
  .then((result) => {
    console.log(`${result.length} products were inserted into the database.`);
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    mongoose.disconnect(); 
  });
