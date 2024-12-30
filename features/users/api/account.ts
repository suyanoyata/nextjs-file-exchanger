"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { User } from "@/features/users/types/users";

const getCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["current-user"],
    queryFn: async () => (await api.get("/api/user")).data.data,
  });
};

export const account = {
  api: {
    getCurrentUser,
  },
};
