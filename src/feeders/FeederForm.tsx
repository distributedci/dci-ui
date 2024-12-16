import { Form, FormGroup, TextInput } from "@patternfly/react-core";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TeamSelect from "teams/form/TeamSelect";
import { IFeeder } from "types";

const FeederSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Feeder name is too short!")
    .required("Feeder name is required"),
  team_id: Yup.string().nullable().required("Team is required"),
});

export default function FeederForm({
  id,
  feeder,
  onSubmit,
  ...props
}: {
  id: string;
  feeder?: IFeeder;
  onSubmit: (values: { name: string; team_id: string }) => void;
  [key: string]: any;
}) {
  const { register, handleSubmit, setValue } = useForm({
    resolver: yupResolver(FeederSchema),
    defaultValues: feeder,
  });
  return (
    <Form id={id} onSubmit={handleSubmit(onSubmit)} {...props}>
      <FormGroup label="Name" isRequired fieldId="feeder_form__name">
        <TextInput
          id="feeder_form__name"
          placeholder="Feeder name"
          isRequired
          {...register("name")}
        />
      </FormGroup>
      <FormGroup label="Team" isRequired fieldId="feeder_form__team_id">
        <TeamSelect
          id="feeder_form__team_id"
          value={feeder ? feeder.team_id : undefined}
          placeholder="Select a team"
          onSelect={(item) => {
            if (item) {
              setValue("team_id", item.id, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
        />
      </FormGroup>
    </Form>
  );
}
