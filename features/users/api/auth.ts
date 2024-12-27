"use client";

import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  LoginUserPayload,
  UserCreatePayload,
} from "@/features/users/types/users";

type AuthApiError = AxiosError & {
  response: {
    data: {
      message: { where: string; message: string }[] | string;
    };
  };
};

const login = () => {
  return useMutation<any, AuthApiError, LoginUserPayload>({
    mutationKey: ["login"],
    mutationFn: async (payload: LoginUserPayload) =>
      await axios.post("/api/auth/login", payload),
  });
};

const register = () => {
  return useMutation<any, AuthApiError, UserCreatePayload>({
    mutationKey: ["create-account"],
    mutationFn: async (payload: UserCreatePayload) =>
      await axios.post("/api/auth/register", payload),
    onError: (error: AxiosError) => {
      return error;
    },
  });
};

export const auth = {
  api: {
    login,
    register,
  },
};
