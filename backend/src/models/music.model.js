const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  quality: { type: String }, // Ví dụ: '128kbps', '320kbps', 'FLAC'
  url: { type: String, required: true },     // Link đến file mp3 hoặc định dạng khác
}, { _id: false });


const musicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    files: [FileSchema],
    lyric: { type: String },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
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

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
