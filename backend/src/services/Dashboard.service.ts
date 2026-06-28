import Student from "../models/Student";
import Achievement from "../models/Achievement";

export const getDashboardData = async () => {
  const totalStudents = await Student.countDocuments({
    isDeleted: false,
  });

  const totalAchievements = await Achievement.countDocuments({
    isDeleted: false,
  });

  const sportsCovered = await Achievement.distinct("game", {
    isDeleted: false,
  });

  const certificatesUploaded = await Achievement.countDocuments({
    isDeleted: false,
    certificate: { $exists: true, $ne: "" },
  });

  const recentStudents = await Student.find({
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name admissionNo class photo");

  const recentAchievements = await Achievement.find({
    isDeleted: false,
  })
    .populate("student", "name admissionNo class photo")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("game competition results date certificate student");

  return {
    totalStudents,
    totalAchievements,
    sportsCovered: sportsCovered.length,
    certificatesUploaded,
    recentStudents,
    recentAchievements,
  };
};