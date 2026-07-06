require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const Player = require("./models/Player");
const User = require("./models/User");

const playersToImport = [];
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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    fs.createReadStream("imports/players.csv")
      .pipe(csv())
      .on("data", (row) => {
  console.log("CSV row found:", row);
  playersToImport.push(row);
})
      .on("end", async () => {
        try {
          for (const row of playersToImport) {
            const existingUser = await User.findOne({ email: row.email });

            if (existingUser) {
              console.log(`Skipped existing user: ${row.email}`);
              continue;
            }

            const player = await Player.create({
  name: row.name,
  slug: generateSlug(row.name),
  playerClass: row.playerClass,
  position: row.position,
  position1: row.position,
  position2: row.position2 || "",
  jerseyNumber: row.jerseyNumber,
  location: "El Paso, TX",
  status: "pending"
});

            const tempPassword =
  row.password && row.password.trim() !== ""
    ? row.password.trim()
    : generateTempPassword();

await User.create({
  email: row.email,
  password: tempPassword,
  role: "player",
  playerId: player._id,
  mustChangePassword: true
});

console.log(`Created account for ${row.name} ✅`);
console.log(`Login for ${row.name}: ${row.email} / ${tempPassword}`);
          }

          console.log("Import complete ✅");
          mongoose.connection.close();
        } catch (err) {
          console.error("Import error:", err);
          mongoose.connection.close();
        }
      });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });