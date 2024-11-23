const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/services', require('./routes/services')); // Example services route

// MongoDB Connection
const dbUri = process.env.DB_URI || `mongodb+srv://Gilbert:${process.env.db_password}@g-portfolio.uknv2.mongodb.net/?retryWrites=true&w=majority&appName=G-PORTFOLIO`;
console.log(dbUri)
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Start Server
const PORT = process.env.PORT || 3000;
console.log(PORT)
app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));
