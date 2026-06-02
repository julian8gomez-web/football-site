require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    const adminEmail = "admin@test.com";
    const newPassword = "AdminTemp123!";

    const admin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!admin) {
      console.log("Admin account not found.");
      mongoose.connection.close();
      return;
    }

    admin.password = newPassword;
    admin.mustChangePassword = false;

    await admin.save();

    console.log(`Admin password reset ✅`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${newPassword}`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Reset error:", err);
    mongoose.connection.close();
  }
}

resetAdminPassword();