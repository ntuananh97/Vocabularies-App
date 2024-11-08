const express = require("express");
const router = express.Router();

const musicControllers = require('../controllers/music.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, musicControllers.createMusic);
router.post("/addToTopic/:topicId/musics/:musicId", protectRoute, musicControllers.addMusicToTopic);
router.get("/", protectRoute, musicControllers.getMusics);
router.get("/:id", protectRoute, musicControllers.getOneMusic);
router.put("/:id", protectRoute, musicControllers.updateMusic);
router.delete("/:id", protectRoute, musicControllers.deleteMusic);
router.delete("/removeFromTopic/:topicId/musics/:musicId", protectRoute, musicControllers.removeMusicFromTopic);

module.exports = router;
