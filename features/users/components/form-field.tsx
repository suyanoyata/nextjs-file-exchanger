import { Input } from "@/components/ui/input";

export const FormField = ({
  fieldName,
  register,
  errors,
  label,
  type = "text",
}: {
  fieldName: string;
  register: any;
  errors: any;
  label: string;
  type?: string;
}) => {
  return (
    <>
      <Input
        autoComplete="off"
        type={type}
        {...register(fieldName)}
        placeholder={label}
      />
      {errors[fieldName] && (
        <p className="text-red-400 text-xs font-medium">
          {errors[fieldName].message}
        </p>
      )}
    </>
  );
};
