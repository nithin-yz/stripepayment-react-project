const express = require('express');
const app = express();
const PORT = 5000;
const Item = require('./Models/Item');
const Order = require('./Models/Order');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OrheASGiZWYvo9CNSo8xkhnXoNOzVtFdgLCqeqOnlBIU61C8wiAd7fCJWUoAv53D79oxWcaCtNixlYafFPsTtjD00fYKUxytn'); // Your secret key here

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'mongodb+srv://tomshift22:hmIIGiOuw7v8zKNe@bestbuy.zxclmeg.mongodb.net/ShoppingApp?retryWrites=true&w=majority&appName=Bestbuy';
mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Route: Get Inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Route: Checkout (Create Payment Intent)
app.post('/api/checkout', async (req, res) => {
  const { cart, name, address, email } = req.body;
  
  let totalAmount = 0;

  // Calculate total amount
  cart.forEach((item) => {
    totalAmount += item.quantity * item.price; // assuming price is in USD
  });



  const lineitems = cart.map((prod) => ({
    price_data: {
      currency: "inr", // Use INR for testing in India
      product_data: {
        name: prod.name,
      },
      unit_amount: Math.round(prod.price * 100), // Convert price to paise
    },
    quantity: prod.quantity,
  }));
  
  

  try {
    // Create a PaymentIntent with the calculated totalAmount
    const paymentIntent = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineitems,
      mode:"payment",
      success_url: "http://localhost:5173/", // Convert to cents (smallest unit)
      cancel_url: 'http://localhost:5173/',
      
    });

    res.json({id:paymentIntent.id})

    const order = new Order({
      cart,
      customer: { name, address, email }, // Save customer info
      totalAmount, // You can also save the totalAmount if needed
      date: new Date(),
    });
    await order.save();

  } catch (err) {

    console.error('Error during checkout:', err);
    res.status(500).json({ error: 'Error processing order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(4); // Limit to the last 2 orders
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
