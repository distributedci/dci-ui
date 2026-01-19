import * as Yup from "yup";
import type { IUser, state } from "types";
import { Form } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInputFormGroup from "ui/form/TextInputFormGroup";
import SelectFormGroup from "ui/form/SelectFormGroup";

const EditUserSchema = Yup.object().shape({
  id: Yup.string().required(),
  etag: Yup.string().required(),
  name: Yup.string()
    .required("User name is required")
    .min(2, "User name is too short!"),
  fullname: Yup.string()
    .required("Full name is required")
    .min(2, "Full name is too short!"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  sso_username: Yup.string(),
  password: Yup.string(),
  state: Yup.string().required(),
});

interface IUserEditForm {
  id: string;
  etag: string;
  name: string;
  fullname: string;
  email: string;
  sso_username: string;
  password?: string;
  state: state;
}

interface EditUserFormProps
  extends Omit<React.ComponentProps<typeof Form>, "onSubmit"> {
  id: string;
  user: IUser;
  onSubmit: (user: IUserEditForm) => void;
}

export default function EditUserForm({
  id,
  user,
  onSubmit,
  ...props
}: EditUserFormProps) {
  const methods = useForm({
    resolver: yupResolver(EditUserSchema),
    defaultValues: {
      id: user.id,
      etag: user.etag,
      name: user.name,
      fullname: user.fullname,
      email: user.email,
      sso_username: user.sso_username,
      password: "",
      state: user.state,
    },
  });
  return (
    <FormProvider {...methods}>
      <Form
        id={id}
        onSubmit={methods.handleSubmit((values) => {
          if (values.password === "") {
            delete values.password;
          }
          return onSubmit(values as IUserEditForm);
        })}
        {...props}
      >
        <TextInputFormGroup
          id="user_form__name"
          name="name"
          label="Login"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__fullname"
          name="fullname"
          label="Full name"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__email"
          name="email"
          label="Email"
          type="email"
          isRequired
        />
        <TextInputFormGroup
          id="user_form__sso_username"
          name="sso_username"
          label="SSO username"
          type="text"
        />
        <TextInputFormGroup
          id="user_form__password"
          name="password"
          label="Password"
          type="password"
        />
        <SelectFormGroup
          id="user_form__state"
          label="State"
          name="state"
          isRequired
          options={[
            {
              label: "active",
              value: "active",
            },
            {
              label: "inactive",
              value: "inactive",
            },
          ]}
        />
      </Form>
    </FormProvider>
  );
}
