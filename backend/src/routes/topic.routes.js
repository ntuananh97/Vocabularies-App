const express = require("express");
const router = express.Router();

const topicControllers = require('../controllers/topic.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, topicControllers.createTopic);
router.get("/", protectRoute, topicControllers.getTopics);
router.get("/:id", protectRoute, topicControllers.getOneTopic);
router.put("/:id", protectRoute, topicControllers.updateTopic);

module.exports = router;
