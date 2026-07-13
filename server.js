require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const Player = require("./models/Player");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("./config/cloudinary");
const Season = require("./models/Season");

//https://football-site-backend-sx8s.onrender.com
//https://football-site-eight.vercel.app/
//AdminTemp123!
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  tls: true,
  tlsAllowInvalidCertificates: true
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB connection error:", err));

// Player schema-- getting pulled from player.js

// POST /players - create a new player
app.post("/players", async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /players - get all players
app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//cd "C:\Users\CTE User\Documents\football-site"
//cd "C:\Users\CTE User\Documents\football-site\client"
//npm run dev

// Start server (ONLY ONCE)
app.get("/admin-only", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome admin ✅" });
});

app.get("/my-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({ error: "Player profile not found" });
    }

    const player = await Player.findById(user.playerId);

    if (!player) {
      return res.status(404).json({ error: "Player profile not found" });
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const seasonStatFields = [
  // Quarterback
  "passingCompletions",
  "passingAttempts",
  "passingYards",
  "passingTouchdowns",
  "interceptionsThrown",

  // Running Back
  "carries",
  "rushingYards",
  "rushingTouchdowns",

  // Receiver / Tight End
"receptions",
"receivingYards",
"receivingTouchdowns",

// Special Teams Returns
"kickoffReturns",
"kickoffReturnYards",
"puntReturns",
"puntReturnYards",

  // Kicker
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "longestFieldGoal",
  "extraPointsMade",
  "extraPointsAttempted",
  "kickoffs",
  "touchbacks",

  // Punter
  "punts",
  "puntYards",
  "longestPunt",
  "puntsInside20",
  "fairCatchesForced",

  // Offensive Line
  "pancakeBlocks",
  "sacksAllowed",
  "gamesStarted",

  // Defense
  "soloTackles",
  "tackleAssists",

  // Legacy total tackles field for older records
  "tackles",

  "tacklesForLoss",
  "sacks",
  "interceptions",
  "passBreakups",
  "forcedFumbles",
  "fumbleRecoveries",
  "qbHurries",

  // General
  "touchdowns"
];

app.put("/my-profile", authMiddleware, async (req, res) => {
  console.log("PUT /my-profile HIT ✅");

  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({ error: "Player profile not found" });
    }

  const allowedUpdates = [
  "name",
  "position",
  "position1",
  "position2",
  "playerClass",
  "height",
  "weight",
  "jerseyNumber",
  "location",
  "hudlLink",
  "contactInfo",
  "twitter",
  "ncaaId",
  "phoneNumber",
  "emailAddress",

  // Recruiting & Exposure
  "collegeOffers",
  "campsAttended",
  "collegesOfInterest",

  "gpa",
  "fortyTime",
  "vertical",
  "broadJump",
  "benchMax",
  "cleanMax",
  "squatMax",
  "passingYards",
  "rushingYards",

  // Defensive tackle breakdown
  "soloTackles",
  "tackleAssists",

  // Legacy total tackles field for older records
  "tackles",

  "sacks",
  "interceptions",
  "touchdowns",
  "passingCompletions",
  "passingAttempts",
  "passingTouchdowns",
  "interceptionsThrown",

  "carries",
  "rushingTouchdowns",

  "receptions",
  "receivingYards",
  "receivingTouchdowns",

  // Special Teams Returns
  "kickoffReturns",
  "kickoffReturnYards",
  "puntReturns",
  "puntReturnYards",

  // Kicker
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "longestFieldGoal",
  "extraPointsMade",
  "extraPointsAttempted",
  "kickoffs",
  "touchbacks",

  // Punter
  "punts",
  "puntYards",
  "longestPunt",
  "puntsInside20",
  "fairCatchesForced",

  "pancakeBlocks",
  "sacksAllowed",
  "gamesStarted",

  "tacklesForLoss",
  "passBreakups",
  "forcedFumbles",
  "fumbleRecoveries",
  "qbHurries",
];

    const player = await Player.findById(user.playerId);

    if (!player) {
      return res.status(404).json({ error: "Player profile not found" });
    }

    const pendingUpdates = {};
const pendingSeasonStats = {};

for (const key of allowedUpdates) {
  if (req.body[key] === undefined) {
    continue;
  }

  if (seasonStatFields.includes(key)) {
    pendingSeasonStats[key] = req.body[key];
  } else {
    pendingUpdates[key] = req.body[key];
  }
}

if (Object.keys(pendingSeasonStats).length > 0) {
  const currentSeason = await Season.findOne({ isCurrent: true });

  if (!currentSeason) {
    return res.status(400).json({
      error: "No current season was found."
    });
  }

  if (currentSeason.isLocked) {
    return res.status(400).json({
      error: `${currentSeason.label} is locked and cannot be edited.`
    });
  }

  pendingUpdates.currentSeasonStats = {
    season: currentSeason.label,
    stats: pendingSeasonStats
  };
}
console.log("BODY RECEIVED:", req.body);
console.log("PENDING UPDATES:", pendingUpdates);

    player.pendingUpdates = {
  ...player.pendingUpdates,
  ...pendingUpdates
};

player.markModified("pendingUpdates");

player.status = "pending";

await player.save();

    res.json({
      message: "Profile changes submitted for review ✅",
      player
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

    
app.get("/admin/pending-players", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const allPlayers = await Player.find();

    const reviewPlayers = allPlayers.filter((player) => {
      const hasPendingUpdates =
        player.pendingUpdates &&
        Object.keys(player.pendingUpdates).length > 0;

      return player.status === "pending" || hasPendingUpdates;
    });

    const formattedPlayers = reviewPlayers.map((player) => {
      const changes = [];

      if (player.pendingUpdates) {
        for (const key in player.pendingUpdates) {
          changes.push({
            field: key,
            oldValue: player[key],
            newValue: player.pendingUpdates[key]
          });
        }
      }

      return {
        ...player.toObject(),
        changes
      };
    });

    res.json(formattedPlayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/admin/approve-player/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const updatesToApply = player.pendingUpdates || {};
const currentSeasonStatsUpdate = updatesToApply.currentSeasonStats;

// Apply normal profile updates.
for (const key in updatesToApply) {
  if (key === "currentSeasonStats") {
    continue;
  }

  player[key] = updatesToApply[key];
}

// Apply football-production updates to the correct season.
if (currentSeasonStatsUpdate) {
  const { season, stats } = currentSeasonStatsUpdate;

  if (!season || !stats) {
    return res.status(400).json({
      error: "The pending season-stat update is incomplete."
    });
  }

  let playerSeason = player.seasonStats.find(
    (seasonEntry) => seasonEntry.season === season
  );

  if (!playerSeason) {
    player.seasonStats.push({
      season,
      isCurrent: true,
      isLocked: false
    });

    playerSeason = player.seasonStats[
      player.seasonStats.length - 1
    ];
  }

  if (playerSeason.isLocked) {
    return res.status(400).json({
      error: `${season} is locked and cannot be updated.`
    });
  }

  for (const statName of seasonStatFields) {
    if (stats[statName] !== undefined) {
      playerSeason[statName] = stats[statName];
    }
  }
}

player.pendingUpdates = {};
player.markModified("pendingUpdates");
player.status = "approved";

    await player.save();

    res.json({
      message: "Player approved ✅",
      player
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/admin/approve-all-pending", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pendingPlayers = await Player.find({ status: "pending" });

    for (const player of pendingPlayers) {
  const updatesToApply = player.pendingUpdates || {};
  const currentSeasonStatsUpdate = updatesToApply.currentSeasonStats;

  // Apply normal profile updates.
  for (const key in updatesToApply) {
    if (key === "currentSeasonStats") {
      continue;
    }

    player[key] = updatesToApply[key];
  }

  // Apply football-production updates to the correct season.
  if (currentSeasonStatsUpdate) {
    const { season, stats } = currentSeasonStatsUpdate;

    if (!season || !stats) {
      return res.status(400).json({
        error: `Pending season-stat update is incomplete for ${player.name}.`
      });
    }

    let playerSeason = player.seasonStats.find(
      (seasonEntry) => seasonEntry.season === season
    );

    if (!playerSeason) {
      player.seasonStats.push({
        season,
        isCurrent: true,
        isLocked: false
      });

      playerSeason = player.seasonStats[
        player.seasonStats.length - 1
      ];
    }

    if (playerSeason.isLocked) {
      return res.status(400).json({
        error: `${season} is locked for ${player.name}.`
      });
    }

    for (const statName of seasonStatFields) {
      if (stats[statName] !== undefined) {
        playerSeason[statName] = stats[statName];
      }
    }
  }

  player.pendingUpdates = {};
  player.markModified("pendingUpdates");
  player.status = "approved";

  await player.save();
}

    res.json({
      message: `${pendingPlayers.length} pending players approved ✅`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/approved-players", async (req, res) => {
  try {
    const approvedPlayers = await Player.find({ status: "approved" });
    res.json(approvedPlayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/player/:slug", async (req, res) => {
  try {
    const player = await Player.findOne({
      slug: req.params.slug,
      status: "approved"
    });

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/admin/reject-player/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const hasPendingUpdates =
      player.pendingUpdates &&
      Object.keys(player.pendingUpdates).length > 0;

    if (hasPendingUpdates) {
      player.pendingUpdates = {};

      if (player.status === "approved") {
        player.status = "approved";
      } else {
        player.status = "rejected";
      }

      await player.save();

      return res.json({
        message: "Pending changes rejected",
        player
      });
    }

    player.status = "rejected";
    await player.save();

    res.json({
      message: "Player rejected",
      player
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
function generateTempPassword() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `Huskies${randomNumber}!`;
}

app.put("/admin/reset-password/:playerId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ playerId: req.params.playerId });

    if (!user) {
      return res.status(404).json({ error: "User account not found for this player." });
    }

    const tempPassword = generateTempPassword();

    user.password = tempPassword;
    user.mustChangePassword = true;

    await user.save();

    res.json({
      message: "Password reset successfully ✅",
      email: user.email,
      tempPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/admin/all-players", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post(
  "/admin/start-new-season",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { startYear } = req.body;
      const year = Number(startYear);

      if (!Number.isInteger(year) || year < 2025 || year > 2100) {
        return res.status(400).json({
          error: "Enter a valid four-digit starting year."
        });
      }

      const currentSeason = await Season.findOne({ isCurrent: true });

      if (!currentSeason) {
        return res.status(400).json({
          error: "No current season was found."
        });
      }

      if (currentSeason.isLocked) {
        return res.status(400).json({
          error: "The current season is already locked."
        });
      }

      const expectedNextYear = currentSeason.startYear + 1;

      if (year !== expectedNextYear) {
        return res.status(400).json({
          error: `The next season must begin in ${expectedNextYear}.`
        });
      }

      const newSeasonLabel = `${year}-${year + 1}`;

      const existingSeason = await Season.findOne({
        label: newSeasonLabel
      });

      if (existingSeason) {
        return res.status(400).json({
          error: `${newSeasonLabel} already exists.`
        });
      }

      currentSeason.isCurrent = false;
      currentSeason.isLocked = true;
      await currentSeason.save();

      const newSeason = await Season.create({
        label: newSeasonLabel,
        startYear: year,
        isCurrent: true,
        isLocked: false
      });

      const players = await Player.find();
      let playersUpdated = 0;

      for (const player of players) {
        if (!Array.isArray(player.seasonStats)) {
          player.seasonStats = [];
        }

        for (const season of player.seasonStats) {
          season.isCurrent = false;
          season.isLocked = true;
        }

        const alreadyHasNewSeason = player.seasonStats.some(
          (season) => season.season === newSeasonLabel
        );

        if (!alreadyHasNewSeason) {
          player.seasonStats.push({
            season: newSeasonLabel,
            isCurrent: true,
            isLocked: false
          });
        } else {
          const matchingSeason = player.seasonStats.find(
            (season) => season.season === newSeasonLabel
          );

          matchingSeason.isCurrent = true;
          matchingSeason.isLocked = false;
        }

        await player.save();
        playersUpdated += 1;
      }

      res.json({
        message: `Season advanced to ${newSeasonLabel} ✅`,
        previousSeason: currentSeason.label,
        currentSeason: newSeason,
        playersUpdated
      });
    } catch (err) {
      console.error("Start-new-season error:", err);
      res.status(500).json({
        error: "Could not advance the season.",
        details: err.message
      });
    }
  }
);
app.post("/upload-profile-picture", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({ error: "Player profile not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chapin-husky-football" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    const player = await Player.findById(user.playerId);

if (!player) {
  return res.status(404).json({ error: "Player not found" });
}

player.pendingUpdates = {
  ...player.pendingUpdates,
  profilePicture: result.secure_url
};

if (player.status !== "approved") {
  player.status = "pending";
}

await player.save();

res.json({
  message: "Profile picture submitted for review ✅",
  imageUrl: result.secure_url,
  player
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/season/current", async (req, res) => {
  try {
    let currentSeason = await Season.findOne({ isCurrent: true });

    if (!currentSeason) {
      currentSeason = await Season.create({
        label: "2025-2026",
        startYear: 2025,
        isCurrent: true,
        isLocked: false
      });
    }

    res.json(currentSeason);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// TEMPORARY TEST-DATA CLEANUP ROUTE
// Remove this route before the website launches.
app.post(
  "/admin/reset-season-testing",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const baseSeasonLabel = "2025-2026";
      const testSeasonLabel = "2026-2027";

      // Remove the test season from the Seasons collection.
      const deletedSeasonResult = await Season.deleteMany({
        label: testSeasonLabel
      });

      // Make every other season non-current.
      await Season.updateMany(
        { label: { $ne: baseSeasonLabel } },
        {
          $set: {
            isCurrent: false
          }
        }
      );

      // Restore or create the 2025-2026 season.
      const baseSeason = await Season.findOneAndUpdate(
        { label: baseSeasonLabel },
        {
          $set: {
            startYear: 2025,
            isCurrent: true,
            isLocked: false
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      const players = await Player.find();
      let playersUpdated = 0;

      for (const player of players) {
        if (!Array.isArray(player.seasonStats)) {
          player.seasonStats = [];
        }

        // Remove the test 2026-2027 season entry.
        player.seasonStats = player.seasonStats.filter(
          (season) => season.season !== testSeasonLabel
        );

        // Set every remaining season as previous/locked for now.
        for (const season of player.seasonStats) {
          season.isCurrent = false;
          season.isLocked = true;
        }

        // Find the correct 2025-2026 entry.
        let basePlayerSeason = player.seasonStats.find(
          (season) => season.season === baseSeasonLabel
        );

        // Add it if this player does not already have it.
        if (!basePlayerSeason) {
          player.seasonStats.push({
            season: baseSeasonLabel,
            isCurrent: true,
            isLocked: false
          });
        } else {
          basePlayerSeason.isCurrent = true;
          basePlayerSeason.isLocked = false;
        }

        await player.save();
        playersUpdated += 1;
      }

      res.json({
        message: "Season testing data reset successfully ✅",
        restoredSeason: baseSeason.label,
        deletedTestSeasonDocuments: deletedSeasonResult.deletedCount,
        playersUpdated
      });
    } catch (err) {
      console.error("Reset-season-testing error:", err);

      res.status(500).json({
        error: "Could not reset the season testing data.",
        details: err.message
      });
    }
  }
);
const PORT = process.env.PORT || 5000;
async function initializeSeason() {
  const currentSeason = await Season.findOne({ isCurrent: true });

  if (!currentSeason) {
    await Season.create({
      label: "2025-2026",
      startYear: 2025,
      isCurrent: true,
      isLocked: false
    });

    console.log("🌟 Initial season created.");
  }
}
initializeSeason();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});