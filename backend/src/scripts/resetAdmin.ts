import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin";

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const username = "admin";
    const password = "Admin@12345";

    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await Admin.findOne();

    if (!admin) {
      admin = await Admin.create({
        username,
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin created.");
    } else {
      admin.username = username;
      admin.password = hashedPassword;
      await admin.save();

      console.log("✅ Admin credentials reset.");
    }

    console.log("----------------------------");
    console.log("Username :", username);
    console.log("Password :", password);
    console.log("----------------------------");

    await mongoose.disconnect();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

resetAdmin();