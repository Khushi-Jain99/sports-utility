import api from "./axios";

// ===============================
// GET ALL ACHIEVEMENTS
// ===============================
export const getAchievements = (params?: any) => {
  return api.get("/achievements", {
    params,
  });
};

// ===============================
// GET ACHIEVEMENT BY ID
// ===============================
export const getAchievementById = (
  id: string
) => {
  return api.get(`/achievements/${id}`);
};

// ===============================
// CREATE ACHIEVEMENT
// ===============================
export const createAchievement = (
  data: any
) => {
  return api.post("/achievements", data);
};

// ===============================
// UPDATE ACHIEVEMENT
// ===============================
export const updateAchievement = (
  id: string,
  data: any
) => {
  return api.patch(
    `/achievements/${id}`,
    data
  );
};

// ===============================
// DELETE ACHIEVEMENT
// ===============================
export const deleteAchievement = (
  id: string
) => {
  return api.delete(
    `/achievements/${id}`
  );
};

// ===============================
// UPLOAD CERTIFICATE
// ===============================
export const uploadCertificate = (
  id: string,
  file: File
) => {
  const formData = new FormData();

  formData.append(
    "certificate",
    file
  );

  return api.post(
    `/achievements/${id}/certificate`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};