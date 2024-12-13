"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { LoginUserPayload } from "@/features/users/types/users";

const login = (payload: LoginUserPayload) => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async () => await axios.post("/api/auth/login", payload),
  });
};

export const auth = {
  api: {
    login,
  },
};
