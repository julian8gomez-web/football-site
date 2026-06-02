require("dotenv").config();

const mongoose = require("mongoose");
const Player = require("./models/Player");

function generateBaseSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(player) {
  const baseSlug = generateBaseSlug(player.name);
  let slug = baseSlug;
  let count = 2;

  while (true) {
    const existingPlayer = await Player.findOne({
      slug,
      _id: { $ne: player._id }
    });

    if (!existingPlayer) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count++;
  }
}

async function addSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    const players = await Player.find();

    for (const player of players) {
      if (player.name) {
        const newSlug = await generateUniqueSlug(player);

        if (player.slug !== newSlug) {
          player.slug = newSlug;
          await player.save();
          console.log(`Slug set for ${player.name}: ${player.slug}`);
        }
      }
    }

    console.log("Slug update complete ✅");
    mongoose.connection.close();
  } catch (err) {
    console.error("Slug update error:", err);
    mongoose.connection.close();
  }
}

addSlugs();