const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables
const router = express.Router();

// Create a transporter using Gmail's SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,  // Your Gmail address
    pass: process.env.EMAIL_PASSWORD,  // Your Gmail password or app-specific password
  },
});

// Registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save it immediately
    const user = new User({ email, password: hashedPassword });

    // Generate a verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL,  // Sender address (configured in .env)
      to: user.email,           // Recipient's email address
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions); // Send the email
    await user.save();
    res.status(200).json({ message: 'Verification email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the decoded user ID and token
    const user = await User.findOne({ _id: decoded.userId, verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationToken = null;  // Remove the verification token
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
});

// Login route
router.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,             // Prevents JavaScript access to cookies
    secure: process.env.NODE_ENV === 'production',  // Ensures cookie is sent over HTTPS in production
    maxAge: 3600000,            // Cookie expiry time (1 hour)
    sameSite: 'Strict',         // Prevents CSRF attacks
  }
}));

// Login Route (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    // Compare the password with the hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token in the session cookie
    req.session.authToken = token;

    // Set the session cookie securely
    res.cookie('authToken', token, {
      httpOnly: true,             // Prevent client-side JS access
      secure: process.env.NODE_ENV === 'production',  // Use HTTPS only in production
      maxAge: 3600000,            // Cookie expiry time (1 hour)
      sameSite: 'Strict',         // Helps prevent CSRF attacks
    });

    // Send success response
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the JWT token from the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }

    // Clear the cookie as well
    res.clearCookie('authToken', { path: '/' });

    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;