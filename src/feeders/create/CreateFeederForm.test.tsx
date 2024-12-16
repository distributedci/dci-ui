import { waitFor } from "@testing-library/react";
import { render } from "__tests__/renders";
import CreateFeederForm from "./CreateFeederForm";
import { vi } from "vitest";
import { teams } from "__tests__/data";

test("test create feeder form submit the correct values", async () => {
  const mockOnSubmit = vi.fn();

  const { user, getByRole } = render(
    <CreateFeederForm teams={teams} onSubmit={mockOnSubmit} />,
  );

  const name = getByRole("textbox", { name: /Name/i });
  await user.type(name, "test");

  const toggle = getByRole("button", { name: "Toggle team_id select" });
  await user.click(toggle);

  const secondTeam = teams[1];
  await waitFor(() => {
    const firstTeamOption = getByRole("option", { name: secondTeam.name });
    user.click(firstTeamOption);
  });

  const createButton = getByRole("button", { name: /Create a feeder/i });
  await waitFor(() => expect(createButton).not.toBeDisabled());
  user.click(createButton);

  await waitFor(() => {
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      name: "test",
      team_id: teams[1].id,
    });
  });
});
