const mongoose = require("mongoose");

const reviewHistorySchema = new mongoose.Schema({
  reviewDate: {
    type: Date,
  },
  step: {
    type: Number,
  }
});

const wordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    keyWord: { type: String, required: true },
    pronounciation: { type: String, required: true },
    definition: { type: String, required: true },
    description: { type: String },
    antonym: { type: String },
    sounds: { type: [String] },
    images: { type: [String] },
    examples: { type: [String] },
    reviewCount: { type: Number, default: 0 },
    step: { type: Number, default: 1 },
    nextReviewDate: { type: Date, required: true },
    reviewHistory: { type: [reviewHistorySchema], default: [] }, 
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
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

const Word = mongoose.model("Word", wordSchema);

module.exports = Word;
