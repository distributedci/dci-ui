import { FormGroup, Checkbox, CheckboxProps } from "@patternfly/react-core";

export default function CheckboxGroup({
  id,
  name,
  label,
  ariaLabel,
  isChecked,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  ariaLabel?: string;
  isChecked: boolean;
  onChange: CheckboxProps["onChange"];
}) {
  return (
    <FormGroup fieldId={id}>
      <Checkbox
        label={label}
        id={id}
        name={name}
        aria-label={ariaLabel || label}
        isChecked={isChecked}
        onChange={onChange}
      />
    </FormGroup>
  );
}
