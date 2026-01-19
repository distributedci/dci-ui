import * as Yup from "yup";
import type { IFeeder } from "types";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TeamSelect from "admin/teams/form/TeamSelect";
import FormErrorMessage from "ui/form/FormErrorMessage";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import { Form, FormGroup } from "@patternfly/react-core";

const FeederSchema = Yup.object().shape({
  name: Yup.string()
    .required("Feeder name is required")
    .min(2, "Feeder name is too short!"),
  team_id: Yup.string().nullable().required("Team is required"),
});

interface FeederFormProps
  extends Omit<React.ComponentProps<typeof Form>, "onSubmit"> {
  id: string;
  feeder?: IFeeder;
  onSubmit: (values: IFeeder | Partial<IFeeder>) => void;
}

export default function FeederForm({
  id,
  feeder,
  onSubmit,
  ...props
}: FeederFormProps) {
  const methods = useForm<{ name: string; team_id: string }>({
    resolver: yupResolver(FeederSchema),
    defaultValues: feeder || { name: "", team_id: "" },
  });
  const teamIdError = methods.formState.errors.team_id;
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        <TextInputFormGroup
          label="Name"
          id="feeder_form__name"
          name="name"
          isRequired
        />
        <FormGroup label="Team" isRequired fieldId="feeder_form__team_id">
          <TeamSelect
            id="feeder_form__team_id"
            value={feeder ? feeder.team_id : undefined}
            placeholder="Select a team"
            hasError={teamIdError !== undefined}
            onSelect={(item) => {
              if (item) {
                methods.setValue("team_id", item.id, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
          <FormErrorMessage error={teamIdError} />
        </FormGroup>
      </Form>
    </FormProvider>
  );
}
