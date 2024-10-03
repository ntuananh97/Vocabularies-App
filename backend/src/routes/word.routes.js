const express = require("express");
const router = express.Router();

const wordControllers = require('../controllers/word.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, wordControllers.createWord);
router.get("/", protectRoute, wordControllers.getWords);
router.get("/:id", protectRoute, wordControllers.getDetailWord);
router.put("/:id", protectRoute, wordControllers.updateOnlyInfoWord);
router.put("/markAsReviewed/:id", protectRoute, wordControllers.markAsReviewed);

module.exports = router;
