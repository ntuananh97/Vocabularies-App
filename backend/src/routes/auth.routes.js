const express = require("express");
const router = express.Router();

const authControllers = require('../controllers/auth.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.get("/me", protectRoute, authControllers.getMe); 

module.exports = router;
