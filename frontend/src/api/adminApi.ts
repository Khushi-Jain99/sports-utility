import api from "./axios";

export const updateCredentials = (data: any) => {
  return api.put(
    "/admin/credentials",
    data
  );
};