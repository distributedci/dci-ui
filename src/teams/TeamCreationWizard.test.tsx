import { renderWithProviders } from "utils/test-utils";
import TeamCreationWizard from "./TeamCreationWizard";
import { fireEvent, screen, waitFor } from "@testing-library/react";

test("team creation wizard", async () => {
  const { user } = renderWithProviders(<TeamCreationWizard />);
  expect(
    screen.queryByRole("button", { name: /Next/i })
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Create a new team/i }));
  expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  await user.type(screen.getByRole("textbox", { name: /Name/i }), "Red Hat");
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  await user.type(
    screen.getByRole("textbox", { name: /Team members/i }),
    "user1@example.org\nuser2@example.org"
  );
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));

  await waitFor(() => {
    expect(
      screen.getByRole("checkbox", { name: /OpenShift/i })
    ).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("checkbox", { name: /OpenShift/i }));
  fireEvent.click(screen.getByRole("button", { name: /Next/i }));
  expect(screen.getByText("Red Hat")).toBeInTheDocument();
  expect(screen.getByText("user1@example.org")).toBeInTheDocument();
  expect(screen.getByText("user2@example.org")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
});
