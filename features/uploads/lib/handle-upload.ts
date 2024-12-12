import axios from "axios";

export const handleUpload = async (files: File[]) => {
  const file = files[0];

  const formData = new FormData();
  formData.append("file", file);

  return axios.post("/api/upload", formData);
};
