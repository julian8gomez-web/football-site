const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: {
  type: String,
  unique: true,
  sparse: true
},

  // basic public profile info
position: String,
position1: String,
position2: String,
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

// QB Stats
passingCompletions: Number,
passingAttempts: Number,
passingTouchdowns: Number,
interceptionsThrown: Number,

// RB Stats
carries: Number,
rushingTouchdowns: Number,

// WR / TE Stats
receptions: Number,
receivingYards: Number,
receivingTouchdowns: Number,

// OL Stats
pancakeBlocks: Number,
sacksAllowed: Number,
gamesStarted: Number,

// Defensive Stats
tacklesForLoss: Number,
passBreakups: Number,
forcedFumbles: Number,
qbHurries: Number,

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