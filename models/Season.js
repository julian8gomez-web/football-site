const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
  },

  startYear: {
    type: Number,
    required: true,
    unique: true
  },

  isCurrent: {
    type: Boolean,
    default: false
  },

  isLocked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Season", seasonSchema);