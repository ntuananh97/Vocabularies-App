const express = require("express");
const router = express.Router();

const uploadImageControllers = require('../controllers/uploadImage.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/uploadSingleFile", protectRoute, uploadImageControllers.uploadSingleFile);

module.exports = router;
