"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/features/users/api/auth";
import { FormField } from "@/features/users/components/form-field";
import {
  LoginUserPayload,
  UserCreatePayload,
  UserCreatePayloadSchema,
} from "@/features/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserCreatePayload>({
    resolver: zodResolver(UserCreatePayloadSchema),
  });

  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error } = auth.api.register();

  useEffect(() => {
    if (isSuccess) {
      router.push("/uploads");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errors = error.response?.data.message;

      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          setError(error.where as "name", {
            message: error.message,
          });
        });
      }
    }
  }, [isError, error]);

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="flex w-full gap-1.5 flex-col"
    >
      <h1 className="text-2xl font-bold pb-4 text-center">Create account</h1>
      <FormField
        fieldName="email"
        register={register}
        errors={errors}
        label="Email"
      />
      <FormField
        fieldName="name"
        register={register}
        errors={errors}
        label="Username"
      />
      <FormField
        fieldName="password"
        register={register}
        errors={errors}
        label="Password"
      />
      <Button type="submit" disabled={isPending}>
        Login
      </Button>
      <Link href="/">
        <Button
          className="dark:hover:bg-zinc-900 hover:bg-zinc-100 w-full"
          variant="ghost"
        >
          I already have account
        </Button>
      </Link>
    </form>
  );
};
