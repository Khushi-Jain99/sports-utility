import bcrypt from "bcryptjs";
import Admin from "../models/Admin";

export const createDefaultAdmin = async () => {

  // Check if ANY admin already exists
  const count = await Admin.countDocuments();

  if (count > 0) return;

  const password = await bcrypt.hash(
    "Sports@2026",
    10
  );

  await Admin.create({
    username: "admin",
    password,
    role: "admin",
  });

  console.log("✅ Default Admin Created");
};