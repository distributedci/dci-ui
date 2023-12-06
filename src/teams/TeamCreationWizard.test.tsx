import { renderWithProviders } from "utils/test-utils";
import TeamCreationWizard from "./TeamCreationWizard";
import { screen, waitFor } from "@testing-library/react";

test("team creation wizard", async () => {
  const { user } = renderWithProviders(<TeamCreationWizard />);

  const onboardingANewTeamButton = await screen.findByRole("button", {
    name: /Onboarding a new team/i,
  });
  user.click(onboardingANewTeamButton);

  const nameTextbox = await screen.findByRole("textbox", { name: /Name/i });
  user.type(nameTextbox, "DCI team");
  await waitFor(() => expect(nameTextbox).toHaveValue("DCI team"));

  const nextButton = await screen.findByRole("button", { name: /Next/i });
  await waitFor(() => expect(nextButton).not.toBeDisabled());
  user.click(nextButton);
  await waitFor(() =>
    expect(screen.getByText("Team members")).toBeInTheDocument(),
  );
  const teamMembersTextarea = await screen.findByRole("textbox", {
    name: /Team members/i,
  });
  user.type(teamMembersTextarea, "rh-login-1\nrh-login-2");
  await waitFor(() =>
    expect(teamMembersTextarea).toHaveValue("rh-login-1\nrh-login-2"),
  );
  user.click(nextButton);
  await waitFor(() =>
    expect(screen.getByText("Product permissions")).toBeInTheDocument(),
  );
  const checkboxOpenShift = await screen.findByRole("checkbox", {
    name: /OpenShift/i,
  });
  user.click(checkboxOpenShift);
  await waitFor(() => expect(checkboxOpenShift).toBeChecked());
  user.click(nextButton);

  await waitFor(() => {
    expect(screen.getByText("DCI team")).toBeInTheDocument();
    expect(screen.getByText("rh-login-1")).toBeInTheDocument();
    expect(screen.getByText("rh-login-2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });
});
