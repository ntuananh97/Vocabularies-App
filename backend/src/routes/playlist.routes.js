const express = require("express");
const router = express.Router();

const playlistControllers = require('../controllers/playlist.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, playlistControllers.createPlaylist);
router.post("/addToTopic/:topicId/playlists/:playlistId", protectRoute, playlistControllers.addPlaylistToTopic);
router.get("/", protectRoute, playlistControllers.getPlaylists);
router.get("/:id", protectRoute, playlistControllers.getOnePlaylist);
router.put("/:id", protectRoute, playlistControllers.updatePlaylist);
router.delete("/:id", protectRoute, playlistControllers.deletePlaylist);
router.delete("/removeFromTopic/:topicId/playlists/:playlistId", protectRoute, playlistControllers.removePlaylistFromTopic);

module.exports = router;
