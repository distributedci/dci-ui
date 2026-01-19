import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@patternfly/react-core";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import type { IRemoteci } from "types";

const RemoteciSchema = Yup.object().shape({
  name: Yup.string()
    .required("Remoteci name is required")
    .min(2, "Remoteci name is too short!"),
});

interface RemoteciFormProps {
  id: string;
  remoteci?: IRemoteci;
  onSubmit: (values: { name: string }) => void;
}

export default function RemoteciForm({
  id,
  remoteci,
  onSubmit,
}: RemoteciFormProps) {
  const methods = useForm<{ name: string }>({
    resolver: yupResolver(RemoteciSchema),
    defaultValues: remoteci || { name: "" },
  });
  return (
    <FormProvider {...methods}>
      <Form id={id} onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInputFormGroup
          label="Name"
          id="remoteci_form__name"
          name="name"
          isRequired
        />
      </Form>
    </FormProvider>
  );
}
