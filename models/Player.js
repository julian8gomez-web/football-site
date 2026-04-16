const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // basic public profile info
position: String,
playerClass: String,
height: String,
weight: String,
jerseyNumber: String,
location: String,
hudlLink: String,
contactInfo: String,
profilePicture: String,
twitter: String,
ncaaId: String,
phoneNumber: String,
emailAddress: String,

// academics / athletic testing
gpa: String,
fortyTime: String,
vertical: String,
benchMax: Number,
cleanMax: Number,
squatMax: Number,

// football production stats
passingYards: Number,
rushingYards: Number,
tackles: Number,
sacks: Number,
interceptions: Number,
touchdowns: Number,

  pendingUpdates: {
    type: Object,
    default: {}
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Player", playerSchema);