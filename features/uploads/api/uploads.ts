"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useUploadsState } from "@/hooks/use-uploads-state";

import { UploadItem, UploadProperties } from "@/features/uploads/types/uploads";

const deleteUpload = () => {
  const queryClient = useQueryClient();

  const { setIsUploadsActionsDisabled } = useUploadsState();
  return useMutation({
    mutationKey: ["deleteUpload"],
    mutationFn: async (name: string) => axios.delete(`/api/uploads/${name}`),
    onMutate: (name: string) => {
      setIsUploadsActionsDisabled(true);
      queryClient.setQueryData(["uploads"], (prev: UploadItem[]) => {
        return prev.filter((upload) => upload.name !== name);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["uploads"],
      });
      setIsUploadsActionsDisabled(false);
    },
  });
};

const getUploads = (uploads: UploadItem[]) => {
  return useQuery<UploadItem[]>({
    queryKey: ["uploads"],
    queryFn: async () => axios.get("/api/uploads").then((res) => res.data.data),
    initialData: uploads,
  });
};

const changeExpirationTime = () => {
  const queryClient = useQueryClient();

  const { setIsUploadsActionsDisabled } = useUploadsState();

  return useMutation({
    mutationKey: ["changeExpirationTime"],
    mutationFn: async ({
      file,
      properties,
    }: {
      file: UploadItem;
      properties: UploadProperties;
    }) =>
      await axios.patch(
        `/api/upload/change-expire/${file.name}?minutes=${properties.expireAfterMinutes}&fromCurrent=${properties.newExpireFromCurrentTime}`
      ),
    onMutate: () => setIsUploadsActionsDisabled(true),
    onSuccess: (response) => {
      const newFile = response.data;

      queryClient.setQueryData(["uploads"], (prev: UploadItem[]) => {
        return prev.map((upload) => {
          if (upload.name === newFile.name) {
            return newFile;
          }
          return upload;
        });
      });

      queryClient.refetchQueries({
        queryKey: ["uploads"],
      });

      setIsUploadsActionsDisabled(false);
    },
  });
};

export const clientUploads = {
  api: {
    getUploads,
    deleteUpload,
    changeExpirationTime,
  },
};
