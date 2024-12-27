import axios from "axios";

export const handleUpload = async (
  files: File[],
  expireDurationInMinutes?: number
) => {
  const file = files[0];

  const formData = new FormData();
  formData.append("file", file);

  if (expireDurationInMinutes) {
    formData.append("expirationTime", expireDurationInMinutes.toString());
  }

  return axios.post("/api/upload", formData);
};
