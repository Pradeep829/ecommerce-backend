const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendApprovedEmail = async (order) => {
  const mailOptions = {
    from: '"eCommerce Simulation" <no-reply@example.com>',
    to: order.customerInfo.email,
    subject: `Order Confirmation - #${order.orderNumber}`,
    html: `
      <h1>Your Order is Confirmed!</h1>
      <p>Dear ${order.customerInfo.fullName},</p>
      <p>Thank you for your purchase! Your order <strong>#${order.orderNumber}</strong> has been successfully placed.</p>
      <h3>Order Summary:</h3>
      <p><strong>Product:</strong> ${order.productDetails.title}</p>
      <p><strong>Variant:</strong> ${order.productDetails.selectedVariant}</p>
      <p><strong>Quantity:</strong> ${order.productDetails.quantity}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <h3>Customer Information:</h3>
      <p><strong>Email:</strong> ${order.customerInfo.email}</p>
      <p><strong>Address:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.state}, ${order.customerInfo.zipCode}</p>
      <p>We'll send you another email when your order ships.</p>
      <p>Sincerely,<br>The eCommerce Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approved email sent to ${order.customerInfo.email}`);
  } catch (error) {
    console.error('Error sending approved email:', error);
  }
};

const sendFailedEmail = async (order) => {
  const mailOptions = {
    from: '"eCommerce Simulation" <no-reply@example.com>',
    to: order.customerInfo.email,
    subject: `Order Transaction Failed - #${order.orderNumber}`,
    html: `
      <h1>Transaction Failed</h1>
      <p>Dear ${order.customerInfo.fullName},</p>
      <p>We regret to inform you that your transaction for order <strong>#${order.orderNumber}</strong> could not be processed at this time.</p>
      <p><strong>Reason:</strong> ${order.transactionStatus === 'declined' ? 'Your payment was declined by your bank.' : 'A payment gateway error occurred.'}</p>
      <p>Please review your payment details or try using a different payment method. If the issue persists, please contact our support team at support@example.com.</p>
      <p>Sincerely,<br>The eCommerce Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Failed email sent to ${order.customerInfo.email}`);
  } catch (error) {
    console.error('Error sending failed email:', error);
  }
};

module.exports = {
  sendApprovedEmail,
  sendFailedEmail,
};