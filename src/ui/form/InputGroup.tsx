import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  TextInputProps,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export default function InputGroup({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = "",
  isRequired = false,
  hasError = false,
  errorMessage = "",
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: TextInputProps["onChange"];
  onBlur: TextInputProps["onBlur"];
  placeholder?: string;
  isRequired?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}) {
  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={id}>
      <TextInput
        isRequired={isRequired}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        validated={hasError ? "error" : "default"}
        placeholder={placeholder}
      />
      {hasError && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
              {errorMessage}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
}
