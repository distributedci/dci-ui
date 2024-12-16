import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";
import { FieldError, useFormContext } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";

interface FormGroupProps {
  id: string;
  label: string;
  name: string;
  isRequired?: boolean;
  placeholder?: string;
  [key: string]: any;
}

export default function TextInputFormGroup({
  id,
  label,
  name,
  isRequired = false,
  placeholder = "",
  ...props
}: FormGroupProps) {
  const methods = useFormContext();
  const error = methods.formState.errors[name] as FieldError;
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id} {...props}>
      <TextInput
        id={id}
        placeholder={placeholder}
        isRequired={isRequired}
        validated={error ? ValidatedOptions.error : ValidatedOptions.default}
        {...methods.register(name)}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
