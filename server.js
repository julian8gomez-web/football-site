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

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri =
  "mongodb+srv://julian8gomez_db_user:Math123rules@chapinhuskyfootball.pabdrla.mongodb.net/football?retryWrites=true&w=majority&tls=true";

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

app.put("/my-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.playerId) {
      return res.status(404).json({ error: "Player profile not found" });
    }

  const allowedUpdates = [
  "name",
  "position",
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
  "benchMax",
  "cleanMax",
  "squatMax",
  "passingYards",
  "rushingYards",
  "tackles",
  "sacks",
  "interceptions",
  "touchdowns"
];

    const player = await Player.findById(user.playerId);

    if (!player) {
      return res.status(404).json({ error: "Player profile not found" });
    }

    const pendingUpdates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        pendingUpdates[key] = req.body[key];
      }
    }

    player.pendingUpdates = {
  ...player.pendingUpdates,
  ...pendingUpdates
};

    if (player.status !== "approved") {
      player.status = "pending";
    }

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

    for (const key in updatesToApply) {
      player[key] = updatesToApply[key];
    }

    player.pendingUpdates = {};
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

app.get("/approved-players", async (req, res) => {
  try {
    const approvedPlayers = await Player.find({ status: "approved" });
    res.json(approvedPlayers);
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

app.get("/admin/all-players", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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

    res.json({
      message: "Profile picture uploaded ✅",
      imageUrl: result.secure_url,
      player: updatedPlayer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});