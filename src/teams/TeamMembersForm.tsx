import { isEmpty } from "lodash";
import { TextArea } from "ui/formik";
import * as Yup from "yup";

export function splitTeamMembersString(teamMembersString: string) {
  return teamMembersString.split(/\r?\n/);
}

export const TeamMembersFormSchema = Yup.object().shape({
  teamMembers: Yup.string().test({
    name: "isAListOfEmail",
    test: function (value) {
      const firstInvalidEmail = splitTeamMembersString(value || "")
        .map((email) => email.trim())
        .filter((v) => !isEmpty(v))
        .find((v) => !Yup.string().email().isValidSync(v));
      return firstInvalidEmail
        ? this.createError({
            message: `The email address '${firstInvalidEmail}' is invalid.`,
          })
        : true;
    },
  }),
});

export interface TeamMembersFormValues {
  teamMembers: "";
}

export default function TeamMembersForm() {
  return (
    <TextArea
      id="users_list_form__team_members"
      label="Team members"
      name="teamMembers"
      placeholder="user1@example.org&#10;user2@example.org"
    />
  );
}
