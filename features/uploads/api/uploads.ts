"use client";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { UploadItem } from "@/features/uploads/types/uploads";

const deleteUpload = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["deleteUpload"],
    mutationFn: async (name: string) => axios.delete(`/api/uploads/${name}`),
    onMutate: (name: string) => {
      queryClient.setQueryData(["uploads"], (prev: UploadItem[]) => {
        return prev.filter((upload) => upload.name !== name);
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["uploads"],
      }),
  });
};

const getUploads = (uploads: UploadItem[]) => {
  return useQuery<UploadItem[]>({
    queryKey: ["uploads"],
    queryFn: async () => axios.get("/api/uploads").then((res) => res.data.data),
    initialData: uploads,
  });
};

export const clientUploads = {
  api: {
    getUploads,
    deleteUpload,
  },
};
