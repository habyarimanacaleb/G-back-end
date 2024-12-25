// filepath: /C:/Users/C/Desktop/codes/G-PORTFOLIO/GilbertPortfolio/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  title: String,
  surname: String,
  otherNames: String,
  dob: String,
  gender: String,
  phone: String,
  email: String,
  residence: String,
  nationality: String,
  fatherName: String,
  motherName: String,
  guardian: String,
  nextOfKinPhone: String,
  prevSchool: String,
  yearOfCompletion: String,
  certificate: String,
  previousActivity: String,
  indexNumber: String,
  nationalID: String,
  passport: String,
  postalAddress: String,
  cell: String,
  sector: String,
  district: String,
});

module.exports = mongoose.model('Application', applicationSchema);