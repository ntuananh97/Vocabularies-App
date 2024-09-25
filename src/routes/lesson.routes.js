const express = require("express");
const router = express.Router();

const lessonControllers = require('../controllers/lesson.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, lessonControllers.createLesson);
router.get("/", protectRoute, lessonControllers.getLessons);

module.exports = router;
