const express = require("express");
const router = express.Router();

const musicControllers = require('../controllers/music.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, musicControllers.createMusic);
// router.get("/", protectRoute, musicControllers.getMusics);
// router.get("/:id", protectRoute, musicControllers.getOneMusic);
// router.put("/:id", protectRoute, musicControllers.updateMusic);

module.exports = router;
