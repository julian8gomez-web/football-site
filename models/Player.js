const mongoose = require("mongoose");

const seasonStatsSchema = new mongoose.Schema(
  {
    season: {
      type: String,
      required: true
    },

    isCurrent: {
      type: Boolean,
      default: false
    },

    isLocked: {
      type: Boolean,
      default: false
    },

    // QB Stats
    passingCompletions: Number,
    passingAttempts: Number,
    passingYards: Number,
    passingTouchdowns: Number,
    interceptionsThrown: Number,

    // RB Stats
    carries: Number,
    rushingYards: Number,
    rushingTouchdowns: Number,

    // WR / TE Stats
    receptions: Number,
    receivingYards: Number,
    receivingTouchdowns: Number,

    // Special Teams Return Stats
    kickoffReturns: Number,
    kickoffReturnYards: Number,
    puntReturns: Number,
    puntReturnYards: Number,

    // Kicker Stats
    fieldGoalsMade: Number,
    fieldGoalsAttempted: Number,
    longestFieldGoal: Number,
    extraPointsMade: Number,
    extraPointsAttempted: Number,
    kickoffs: Number,
    touchbacks: Number,

    // Punter Stats
    punts: Number,
    puntYards: Number,
    longestPunt: Number,
    puntsInside20: Number,
    fairCatchesForced: Number,

    // OL Stats
    pancakeBlocks: Number,
    sacksAllowed: Number,
    gamesStarted: Number,

    // Defense
    soloTackles: Number,
    tackleAssists: Number,
    tackles: Number,
    tacklesForLoss: Number,
    sacks: Number,
    interceptions: Number,
    passBreakups: Number,
    forcedFumbles: Number,
    fumbleRecoveries: Number,
    qbHurries: Number,

    // General / all-purpose
    touchdowns: Number
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },

  slug: {
    type: String,
    unique: true,
    sparse: true
  },

  // Basic public profile info
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

  // Recruiting & exposure
  collegeOffers: {
    type: [String],
    default: []
  },

  campsAttended: {
    type: [String],
    default: []
  },

  collegesOfInterest: {
    type: [String],
    default: []
  },

  // Academics / athletic testing
  gpa: String,
  fortyTime: String,
  vertical: String,
  broadJump: String,
  benchMax: Number,
  cleanMax: Number,
  squatMax: Number,

  // Legacy top-level football fields kept for older records
  passingYards: Number,
  rushingYards: Number,
  tackles: Number,
  sacks: Number,
  interceptions: Number,
  touchdowns: Number,
  passingCompletions: Number,
  passingAttempts: Number,
  passingTouchdowns: Number,
  interceptionsThrown: Number,
  carries: Number,
  rushingTouchdowns: Number,
  receptions: Number,
  receivingYards: Number,
  receivingTouchdowns: Number,
  pancakeBlocks: Number,
  sacksAllowed: Number,
  gamesStarted: Number,
  soloTackles: Number,
  tackleAssists: Number,
  tacklesForLoss: Number,
  passBreakups: Number,
  forcedFumbles: Number,
  fumbleRecoveries: Number,
  qbHurries: Number,
  kickoffReturns: Number,
  kickoffReturnYards: Number,
  puntReturns: Number,
  puntReturnYards: Number,
  fieldGoalsMade: Number,
  fieldGoalsAttempted: Number,
  longestFieldGoal: Number,
  extraPointsMade: Number,
  extraPointsAttempted: Number,
  kickoffs: Number,
  touchbacks: Number,
  punts: Number,
  puntYards: Number,
  longestPunt: Number,
  puntsInside20: Number,
  fairCatchesForced: Number,

  seasonStats: {
    type: [seasonStatsSchema],
    default: []
  },

  // Profile activity tracking
  lastSubmittedAt: {
    type: Date,
    default: null
  },

  lastApprovedAt: {
    type: Date,
    default: null
  },

  lastApprovedBy: {
    type: String,
    default: ""
  },

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
