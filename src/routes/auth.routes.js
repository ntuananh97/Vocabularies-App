const express = require("express");
const router = express.Router();

const authControllers = require('../controllers/auth.controller');

router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);

module.exports = router;
