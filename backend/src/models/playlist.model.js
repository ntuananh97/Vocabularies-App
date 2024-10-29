const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      }
    ],
    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      }
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
