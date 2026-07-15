require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const Player = require("./models/Player");
const User = require("./models/User");

const INPUT_FILE = path.join(__dirname, "imports", "players.csv");
const OUTPUT_FILE = path.join(
  __dirname,
  "imports",
  `player_credentials_${new Date().toISOString().slice(0, 10)}.csv`
);

const playersToImport = [];
const createdCredentials = [];

function generateTempPassword() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `Huskies${randomNumber}!`;
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeCsvValue(value) {
  const text = String(value ?? "");

  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function saveCredentialsCsv() {
  if (createdCredentials.length === 0) {
    console.log(
      "No credentials file created because no new players were imported."
    );
    return;
  }

  const header = "name,email,temporaryPassword\n";

  const rows = createdCredentials
    .map((item) =>
      [
        escapeCsvValue(item.name),
        escapeCsvValue(item.email),
        escapeCsvValue(item.temporaryPassword)
      ].join(",")
    )
    .join("\n");

  fs.writeFileSync(OUTPUT_FILE, header + rows + "\n", "utf8");

  console.log(`Credentials saved to: ${OUTPUT_FILE}`);
}

async function importPlayers() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Could not find CSV file: ${INPUT_FILE}`);
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected ✅");

  await new Promise((resolve, reject) => {
    fs.createReadStream(INPUT_FILE)
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            String(header)
              .replace(/^\uFEFF/, "")
              .trim()
        })
      )
      .on("data", (row) => {
        const cleanedRow = {};

        for (const [key, value] of Object.entries(row)) {
          cleanedRow[String(key).trim()] =
            typeof value === "string" ? value.trim() : value;
        }

        playersToImport.push(cleanedRow);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Found ${playersToImport.length} row(s) in players.csv.`);

  for (const row of playersToImport) {
    const name = String(row.name || "").trim();
    const normalizedEmail = String(row.email || "")
      .trim()
      .toLowerCase();
    const playerClass = String(row.playerClass || "").trim();
    const position = String(row.position || "")
      .trim()
      .toUpperCase();
    const position2 = String(row.position2 || "")
      .trim()
      .toUpperCase();
    const jerseyNumber = String(row.jerseyNumber || "").trim();

    if (!name || !normalizedEmail || !playerClass || !position) {
      console.log("Skipped invalid row:", row);
      continue;
    }

    const slug = generateSlug(name);

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    const existingPlayer = await Player.findOne({
      $or: [{ emailAddress: normalizedEmail }, { slug }]
    });

    if (existingUser || existingPlayer) {
      console.log(
        `Skipped existing player/account: ${name} (${normalizedEmail})`
      );
      continue;
    }

    const tempPassword =
      row.password && String(row.password).trim() !== ""
        ? String(row.password).trim()
        : generateTempPassword();

    let player;

    try {
      player = await Player.create({
        name,
        slug,
        emailAddress: normalizedEmail,
        playerClass,
        position,
        position1: position,
        position2,
        jerseyNumber,
        location: "El Paso, TX",
        status: "pending"
      });

      await User.create({
        email: normalizedEmail,
        password: tempPassword,
        role: "player",
        playerId: player._id,
        mustChangePassword: true
      });

      createdCredentials.push({
        name,
        email: normalizedEmail,
        temporaryPassword: tempPassword
      });

      console.log(`Created account for ${name} ✅`);
    } catch (error) {
      if (player?._id) {
        await Player.findByIdAndDelete(player._id);
      }

      console.error(
        `Failed to create ${name} (${normalizedEmail}): ${error.message}`
      );
    }
  }

  saveCredentialsCsv();

  console.log(
    `Import complete: ${createdCredentials.length} new player account(s) created.`
  );
}

importPlayers()
  .catch((error) => {
    console.error("Import failed:", error.message);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
