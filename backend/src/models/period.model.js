const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nextViewDay: { type: Number, required: true },
    step: { type: Number, required: true },
 
  },
  {
    timestamps: true,
  }
);

const Period = mongoose.model("Period", periodSchema);

module.exports = Period;
