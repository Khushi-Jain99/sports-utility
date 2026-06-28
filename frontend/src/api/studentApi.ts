import api from "./axios";

// ===============================
// GET ALL STUDENTS
// ===============================
export const getStudents = (params?: any) => {
  return api.get("/students", {
    params,
  });
};

// ===============================
// GET STUDENT BY ID
// ===============================
export const getStudentById = (id: string) => {
  return api.get(`/students/${id}`);
};

// ===============================
// CREATE STUDENT
// ===============================
export const createStudent = (data: any) => {
  return api.post("/students", data);
};

// ===============================
// UPDATE STUDENT
// ===============================
export const updateStudent = (
  id: string,
  data: any
) => {
  return api.patch(`/students/${id}`, data);
};

// ===============================
// DELETE STUDENT
// ===============================
export const deleteStudent = (id: string) => {
  return api.delete(`/students/${id}`);
};

// ===============================
// UPLOAD STUDENT PHOTO
// ===============================
export const uploadStudentPhoto = (
  id: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("photo", file);

  return api.post(
    `/students/${id}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ===============================
// SEARCH STUDENTS
// ===============================
export const searchStudents = (
  search: string
) => {
  return api.get("/students", {
    params: {
      search,
      limit: 100,
    },
  });
};