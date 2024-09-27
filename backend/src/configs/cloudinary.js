const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const process = require("process"); // Add this line to import the 'process' module

dotenv.config();

const optionsCloundinary = {};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  cloudinary,
  optionsCloundinary,
};
