import api from "./axios";

export const uploadExcel = (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/excel/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};