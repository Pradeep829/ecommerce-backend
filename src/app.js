const express = require('express');
const cors = require('cors');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000' // Allow requests from your frontend
}));
app.use(express.json()); // Body parser for JSON

// Routes
app.use('/api', checkoutRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;