import { Input } from "@/components/ui/input";

export const FormField = ({
  fieldName,
  register,
  errors,
  label,
}: {
  fieldName: string;
  register: any;
  errors: any;
  label: string;
}) => {
  return (
    <>
      <Input type={fieldName} {...register(fieldName)} placeholder={label} />
      {errors[fieldName] && (
        <p className="text-red-400 text-sm">{errors[fieldName].message}</p>
      )}
    </>
  );
};
