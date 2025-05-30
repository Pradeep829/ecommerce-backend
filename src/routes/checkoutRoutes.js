const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mailService = require('../services/mailService');
const { v4: uuidv4 } = require('uuid'); // For unique order numbers

router.post('/checkout', async (req, res) => {
  const { customerInfo, productDetails, transactionSimulation } = req.body;

  if (!customerInfo || !productDetails || !transactionSimulation) {
    return res.status(400).json({ message: 'Missing required checkout data.' });
  }

  let transactionStatus = '';
  let confirmationMessage = '';

  // Simulate transaction based on the first digit of the card number
  switch (transactionSimulation) {
    case '1':
      transactionStatus = 'approved';
      confirmationMessage = 'Your order has been successfully processed!';
      break;
    case '2':
      transactionStatus = 'declined';
      confirmationMessage = 'Your transaction was declined. Please check your payment details or try again.';
      break;
    case '3':
      transactionStatus = 'gateway_error';
      confirmationMessage = 'A payment gateway error occurred. Please try again later or contact support.';
      break;
    default:
      transactionStatus = 'gateway_error'; // Default to error for invalid inputs
      confirmationMessage = 'Invalid payment simulation. Please try again.';
  }

  const orderNumber = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
  const total = productDetails.subtotal; // Simple total for now

  const newOrder = new Order({
    orderNumber,
    customerInfo,
    productDetails: {
      ...productDetails,
      selectedVariant: productDetails.selectedVariant?.value // Store a simpler representation
    },
    total,
    transactionStatus
  });

  try {
    await newOrder.save();

    // Send email based on transaction status
    if (transactionStatus === 'approved') {
      await mailService.sendApprovedEmail(newOrder);
    } else {
      await mailService.sendFailedEmail(newOrder);
    }

    res.status(200).json({
      message: 'Checkout processed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ message: 'Server error during checkout.', error: error.message });
  }
});

module.exports = router;