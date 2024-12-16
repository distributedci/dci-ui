import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";

interface TextInputFormGroupProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  hasError?: boolean;
  [key: string]: any;
}

export default function TextInputFormGroup<T extends FieldValues>({
  label,
  name,
  control,
  isRequired = false,
  placeholder = "",
  textInputProps,
  ...props
}: TextInputFormGroupProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <FormGroup
      label={label}
      isRequired={isRequired}
      fieldId={`field_${name}`}
      {...props}
    >
      <TextInput
        id={`field_${name}`}
        placeholder={placeholder}
        isRequired={isRequired}
        validated={error ? ValidatedOptions.error : ValidatedOptions.default}
        {...field}
      />
      <FormErrorMessage error={error} />
    </FormGroup>
  );
}
