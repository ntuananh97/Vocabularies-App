const mongoose = require("mongoose");

const musicHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "typeHistory",
    },
    typeHistory: { type: String, required: true, enum: ["Music", "Playlist"] },
  },
  {
    timestamps: true,
  }
);

const MusicHistory = mongoose.model("MusicHistory", musicHistorySchema);

module.exports = MusicHistory;
