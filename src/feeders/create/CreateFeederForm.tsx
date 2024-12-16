import { Button, Form, FormGroup, TextInput } from "@patternfly/react-core";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TeamSelect from "teams/form/TeamSelect";

const CreateFeederSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Feeder name is too short!")
    .required("Feeder name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface CreateFeederFormProps {
  onSubmit: (values: { name: string; team_id: string }) => void;
}

export default function CreateFeederForm({ onSubmit }: CreateFeederFormProps) {
  const {
    register,
    formState: { isDirty, isValid },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(CreateFeederSchema),
    defaultValues: { name: "", team_id: "" },
  });

  return (
    <Form id="create_feeder_form" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup label="Name" isRequired fieldId="create_feeder_form__name">
        <TextInput
          id="create_feeder_form__name"
          placeholder="Feeder name"
          isRequired
          {...register("name")}
        />
      </FormGroup>
      <FormGroup label="Team" isRequired fieldId="create_feeder_form__team_id">
        <TeamSelect
          id="create_feeder_form__team_id"
          name="team_id"
          placeholder="Select a team"
          onSelect={(item) => {
            if (item) {
              setValue("team_id", item.id, { shouldValidate: true });
            }
          }}
        />
      </FormGroup>
      <Button
        variant="primary"
        type="submit"
        isDisabled={!(isValid && isDirty)}
      >
        Create a feeder
      </Button>
    </Form>
  );
}
