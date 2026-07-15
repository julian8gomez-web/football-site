require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");

const User = require("./models/User");
const Player = require("./models/Player");
const Season = require("./models/Season");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const cloudinary = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing from the environment.");
  process.exit(1);
}

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 30000,
    tls: true,
    tlsAllowInvalidCertificates: true
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));

const seasonStatFields = [
  "passingCompletions",
  "passingAttempts",
  "passingYards",
  "passingTouchdowns",
  "interceptionsThrown",
  "carries",
  "rushingYards",
  "rushingTouchdowns",
  "receptions",
  "receivingYards",
  "receivingTouchdowns",
  "kickoffReturns",
  "kickoffReturnYards",
  "puntReturns",
  "puntReturnYards",
  "fieldGoalsMade",
  "fieldGoalsAttempted",
  "longestFieldGoal",
  "extraPointsMade",
  "extraPointsAttempted",
  "kickoffs",
  "touchbacks",
  "punts",
  "puntYards",
  "longestPunt",
  "puntsInside20",
  "fairCatchesForced",
  "pancakeBlocks",
  "sacksAllowed",
  "gamesStarted",
  "soloTackles",
  "tackleAssists",
  "tackles",
  "tacklesForLoss",
  "sacks",
  "interceptions",
  "passBreakups",
  "forcedFumbles",
  "fumbleRecoveries",
  "qbHurries",
  "touchdowns"
];

const arrayProfileFields = [
  "collegeOffers",
  "campsAttended",
  "collegesOfInterest"
];

const numericProfileFields = [
  "benchMax",
  "cleanMax",
  "squatMax"
];

const stringProfileFields = [
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
  "gpa",
  "fortyTime",
  "vertical",
  "broadJump"
];

const allowedProfileFields = [
  ...stringProfileFields,
  ...numericProfileFields,
  ...arrayProfileFields
];

function normalizeArrayValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizedComparable(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
}

function valuesMatch(left, right) {
  return (
    JSON.stringify(normalizedComparable(left)) ===
    JSON.stringify(normalizedComparable(right))
  );
}

function getCurrentPlayerSeason(player, seasonLabel) {
  if (!Array.isArray(player.seasonStats)) {
    return null;
  }

  return (
    player.seasonStats.find(
      (entry) => entry.season === seasonLabel
    ) ||
    player.seasonStats.find((entry) => entry.isCurrent) ||
    null
  );
}

function buildChanges(player) {
  const changes = [];
  const pendingUpdates = player.pendingUpdates || {};

  for (const key of Object.keys(pendingUpdates)) {
    if (key === "currentSeasonStats") {
      const requested = pendingUpdates.currentSeasonStats || {};
      const seasonLabel = requested.season;
      const currentSeason = getCurrentPlayerSeason(player, seasonLabel);

      changes.push({
        field: "currentSeasonStats",
        oldValue: currentSeason ? currentSeason.toObject?.() || currentSeason : {},
        newValue: requested
      });

      continue;
    }

    changes.push({
      field: key,
      oldValue: player[key],
      newValue: pendingUpdates[key]
    });
  }

  return changes;
}

function formatPlayerForAdmin(player) {
  return {
    ...player.toObject(),
    changes: buildChanges(player)
  };
}

app.post("/players", async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(
  "/admin-only",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({ message: "Welcome admin ✅" });
  }
);

app.get("/my-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({
        error: "Player profile not found"
      });
    }

    const player = await Player.findById(user.playerId);

    if (!player) {
      return res.status(404).json({
        error: "Player profile not found"
      });
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/my-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({
        error: "Player profile not found"
      });
    }

    const player = await Player.findById(user.playerId);

    if (!player) {
      return res.status(404).json({
        error: "Player profile not found"
      });
    }

    const existingPending = player.pendingUpdates || {};
    const newPendingUpdates = {};
    const pendingSeasonStats = {};

    for (const key of allowedProfileFields) {
      if (!Object.prototype.hasOwnProperty.call(req.body, key)) {
        continue;
      }

      let requestedValue = req.body[key];

      if (arrayProfileFields.includes(key)) {
        requestedValue = normalizeArrayValue(requestedValue);
      } else if (numericProfileFields.includes(key)) {
        if (
          requestedValue === "" ||
          requestedValue === null ||
          requestedValue === undefined
        ) {
          requestedValue = null;
        } else {
          requestedValue = Number(requestedValue);

          if (!Number.isFinite(requestedValue)) {
            return res.status(400).json({
              error: `${key} must be a valid number.`
            });
          }
        }
      } else if (typeof requestedValue === "string") {
        requestedValue = requestedValue.trim();
      }

      const comparisonValue =
        Object.prototype.hasOwnProperty.call(existingPending, key)
          ? existingPending[key]
          : player[key];

      if (!valuesMatch(comparisonValue, requestedValue)) {
        newPendingUpdates[key] = requestedValue;
      }
    }

    const currentSeason = await Season.findOne({ isCurrent: true });

    for (const key of seasonStatFields) {
      if (!Object.prototype.hasOwnProperty.call(req.body, key)) {
        continue;
      }

      const rawValue = req.body[key];

      // Critical safety rule:
      // blank/null football fields never overwrite stored season stats.
      if (
        rawValue === "" ||
        rawValue === null ||
        rawValue === undefined
      ) {
        continue;
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return res.status(400).json({
          error: `${key} must be a valid whole number.`
        });
      }

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

      const currentPlayerSeason = getCurrentPlayerSeason(
        player,
        currentSeason.label
      );

      const existingPendingStats =
        existingPending.currentSeasonStats?.season === currentSeason.label
          ? existingPending.currentSeasonStats.stats || {}
          : {};

      const comparisonValue =
        Object.prototype.hasOwnProperty.call(existingPendingStats, key)
          ? existingPendingStats[key]
          : currentPlayerSeason?.[key];

      if (!valuesMatch(comparisonValue, numericValue)) {
        pendingSeasonStats[key] = numericValue;
      }
    }

    if (Object.keys(pendingSeasonStats).length > 0) {
      newPendingUpdates.currentSeasonStats = {
        season: currentSeason.label,
        stats: {
          ...(existingPending.currentSeasonStats?.season ===
          currentSeason.label
            ? existingPending.currentSeasonStats.stats || {}
            : {}),
          ...pendingSeasonStats
        }
      };
    }

    if (Object.keys(newPendingUpdates).length === 0) {
      return res.json({
        message: "No new profile changes were found.",
        player
      });
    }

    player.pendingUpdates = {
      ...existingPending,
      ...newPendingUpdates
    };

    player.markModified("pendingUpdates");
    player.status = "pending";
    player.lastSubmittedAt = new Date();

    await player.save();

    res.json({
      message: "Profile changes submitted for review ✅",
      player
    });
  } catch (err) {
    console.error("PUT /my-profile error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get(
  "/admin/pending-players",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const allPlayers = await Player.find();

      const reviewPlayers = allPlayers.filter((player) => {
        const hasPendingUpdates =
          player.pendingUpdates &&
          Object.keys(player.pendingUpdates).length > 0;

        return player.status === "pending" || hasPendingUpdates;
      });

      res.json(reviewPlayers.map(formatPlayerForAdmin));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

async function applyPendingUpdates(player, approvingCoach) {
  const updatesToApply = player.pendingUpdates || {};
  const currentSeasonStatsUpdate =
    updatesToApply.currentSeasonStats;

  for (const key of Object.keys(updatesToApply)) {
    if (key === "currentSeasonStats") {
      continue;
    }

    if (arrayProfileFields.includes(key)) {
      player[key] = normalizeArrayValue(updatesToApply[key]);
    } else {
      player[key] = updatesToApply[key];
    }
  }

  if (currentSeasonStatsUpdate) {
    const { season, stats } = currentSeasonStatsUpdate;

    if (!season || !stats) {
      throw new Error(
        "The pending season-stat update is incomplete."
      );
    }

    let playerSeason = getCurrentPlayerSeason(player, season);

    if (!playerSeason || playerSeason.season !== season) {
      player.seasonStats.push({
        season,
        isCurrent: true,
        isLocked: false
      });

      playerSeason =
        player.seasonStats[player.seasonStats.length - 1];
    }

    if (playerSeason.isLocked) {
      throw new Error(
        `${season} is locked and cannot be updated.`
      );
    }

    for (const statName of seasonStatFields) {
      if (!Object.prototype.hasOwnProperty.call(stats, statName)) {
        continue;
      }

      const value = stats[statName];

      // Second backend safety layer.
      if (value === "" || value === null || value === undefined) {
        continue;
      }

      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) {
        continue;
      }

      playerSeason[statName] = numericValue;
    }
  }

  player.pendingUpdates = {};
  player.markModified("pendingUpdates");
  player.status = "approved";
  player.lastApprovedAt = new Date();
  player.lastApprovedBy =
    approvingCoach?.displayName ||
    approvingCoach?.email ||
    "Chapin Football Staff";

  await player.save();
}

app.put(
  "/admin/approve-player/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);

      if (!player) {
        return res.status(404).json({
          error: "Player not found"
        });
      }

      const approvingCoach = await User.findById(req.user.id);

      await applyPendingUpdates(player, approvingCoach);

      res.json({
        message: "Player approved ✅",
        player
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.put(
  "/admin/approve-all-pending",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const approvingCoach = await User.findById(req.user.id);

      const pendingPlayers = await Player.find({
        $or: [
          { status: "pending" },
          { pendingUpdates: { $ne: {} } }
        ]
      });

      let approvedCount = 0;

      for (const player of pendingPlayers) {
        if (
          !player.pendingUpdates ||
          Object.keys(player.pendingUpdates).length === 0
        ) {
          continue;
        }

        await applyPendingUpdates(player, approvingCoach);
        approvedCount += 1;
      }

      res.json({
        message: `${approvedCount} pending players approved ✅`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/approved-players", async (req, res) => {
  try {
    const approvedPlayers = await Player.find({
      status: "approved"
    });

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
      return res.status(404).json({
        error: "Player not found"
      });
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(
  "/admin/reject-player/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);

      if (!player) {
        return res.status(404).json({
          error: "Player not found"
        });
      }

      const hadApprovedProfile = Boolean(player.lastApprovedAt);

      player.pendingUpdates = {};
      player.markModified("pendingUpdates");
      player.status = hadApprovedProfile
        ? "approved"
        : "rejected";

      await player.save();

      res.json({
        message: "Pending changes rejected",
        player
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

function generateTempPassword() {
  const randomNumber = Math.floor(
    1000 + Math.random() * 9000
  );

  return `Huskies${randomNumber}!`;
}

app.put(
  "/admin/reset-password/:playerId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({
        playerId: req.params.playerId
      });

      if (!user) {
        return res.status(404).json({
          error: "User account not found for this player."
        });
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
  }
);

app.get(
  "/admin/all-players",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const players = await Player.find();
      res.json(players.map(formatPlayerForAdmin));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.post(
  "/admin/start-new-season",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { startYear } = req.body;
      const year = Number(startYear);

      if (
        !Number.isInteger(year) ||
        year < 2025 ||
        year > 2100
      ) {
        return res.status(400).json({
          error: "Enter a valid four-digit starting year."
        });
      }

      const currentSeason = await Season.findOne({
        isCurrent: true
      });

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

        for (const seasonEntry of player.seasonStats) {
          seasonEntry.isCurrent = false;
          seasonEntry.isLocked = true;
        }

        let matchingSeason = player.seasonStats.find(
          (seasonEntry) =>
            seasonEntry.season === newSeasonLabel
        );

        if (!matchingSeason) {
          player.seasonStats.push({
            season: newSeasonLabel,
            isCurrent: true,
            isLocked: false
          });
        } else {
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

app.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user || !user.playerId) {
        return res.status(404).json({
          error: "Player profile not found"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "No image file uploaded"
        });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "chapin-husky-football"
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        });

      const result = await streamUpload();

      const player = await Player.findById(user.playerId);

      if (!player) {
        return res.status(404).json({
          error: "Player not found"
        });
      }

      player.pendingUpdates = {
        ...(player.pendingUpdates || {}),
        profilePicture: result.secure_url
      };

      player.markModified("pendingUpdates");
      player.status = "pending";
      player.lastSubmittedAt = new Date();

      await player.save();

      res.json({
        message: "Profile picture submitted for review ✅",
        imageUrl: result.secure_url,
        player
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/season/current", async (req, res) => {
  try {
    let currentSeason = await Season.findOne({
      isCurrent: true
    });

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

// Temporary testing route. Remove after season testing is complete.
app.post(
  "/admin/reset-season-testing",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const baseSeasonLabel = "2025-2026";
      const testSeasonLabel = "2026-2027";

      const deletedSeasonResult = await Season.deleteMany({
        label: testSeasonLabel
      });

      await Season.updateMany(
        { label: { $ne: baseSeasonLabel } },
        { $set: { isCurrent: false } }
      );

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

        player.seasonStats = player.seasonStats.filter(
          (seasonEntry) =>
            seasonEntry.season !== testSeasonLabel
        );

        for (const seasonEntry of player.seasonStats) {
          seasonEntry.isCurrent = false;
          seasonEntry.isLocked = true;
        }

        let basePlayerSeason = player.seasonStats.find(
          (seasonEntry) =>
            seasonEntry.season === baseSeasonLabel
        );

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
        deletedTestSeasonDocuments:
          deletedSeasonResult.deletedCount,
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
  const currentSeason = await Season.findOne({
    isCurrent: true
  });

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
