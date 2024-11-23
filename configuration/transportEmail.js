// emailTransporter.js
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use another email service like SendGrid, etc.
  auth: {
    user: process.env.EMAIL,  // Your email address (configured in .env file)
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Test the transporter (optional)
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter setup failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

module.exports = transporter;
