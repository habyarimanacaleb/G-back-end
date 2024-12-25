// filepath: /C:/Users/C/Desktop/codes/G-PORTFOLIO/GilbertPortfolio/routes/applicationRoutes.js
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Application = require('../models/Application');
const router = express.Router();

// Load environment variables
dotenv.config();

// Configure nodemailer transporter (for sending emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Application form submission route (POST)
router.post('/application', async (req, res) => {
  const formData = req.body;

  // Validate required fields
  const requiredFields = [
    'title', 'surname', 'phone', 'email', 'dob', 'gender', 'residence', 'nationality', 'fatherName', 'motherName'
  ];

  for (let field of requiredFields) {
    if (!formData[field]) {
      return res.status(400).json({ message: `Missing required field: ${field}` });
    }
  }

  // Save form data to MongoDB
  const application = new Application(formData);
  try {
    await application.save();

    // Compose the email with the form data
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,  // Send to your email
      subject: 'New Application Submission',
      text: `A new application has been submitted with the following details:\n\n
        Title: ${formData.title}\n
        Surname: ${formData.surname}\n
        Other Names: ${formData.otherNames}\n
        Date of Birth: ${formData.dob}\n
        Gender: ${formData.gender}\n
        Phone: ${formData.phone}\n
        Email: ${formData.email}\n
        Residence: ${formData.residence}\n
        Nationality: ${formData.nationality}\n
        Father's Name: ${formData.fatherName}\n
        Mother's Name: ${formData.motherName}\n
        Guardian: ${formData.guardian}\n
        Next of Kin Phone: ${formData.nextOfKinPhone}\n
        Previous School: ${formData.prevSchool}\n
        Year of Completion: ${formData.yearOfCompletion}\n
        Certificate: ${formData.certificate}\n
        Previous Activity: ${formData.previousActivity}\n
        Index Number: ${formData.indexNumber}\n
        National ID: ${formData.nationalID}\n
        Passport Number: ${formData.passport}\n
        Postal Address: ${formData.postalAddress}\n
        Cell: ${formData.cell}\n
        Sector: ${formData.sector}\n
        District: ${formData.district}\n\n
        This email confirms that the application was received successfully.`,
    };

    // Send the email with form data
    await transporter.sendMail(mailOptions);  // Send the email
    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving application or sending email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to retrieve all form data
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Application.find();
    if (submissions.length === 0) {
      return res.status(404).json({ message: 'No form submissions found.' });
    }
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;