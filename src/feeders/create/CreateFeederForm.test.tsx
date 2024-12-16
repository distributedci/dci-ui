import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "__tests__/renders";
import CreateFeederForm from "./CreateFeederForm";
import { vi } from "vitest";
import { teams } from "__tests__/data";
import { server } from "__tests__/node";
import { http, HttpResponse } from "msw";
import { IGetTeams } from "types";

test("test create feeder form submit the correct values", async () => {
  server.use(
    http.get("https://api.distributed-ci.io/api/v1/teams", () => {
      return HttpResponse.json({
        _meta: {
          count: teams.length,
        },
        teams,
      } as IGetTeams);
    }),
  );

  const mockOnSubmit = vi.fn();
  const { user, getByRole } = renderWithProviders(
    <CreateFeederForm onSubmit={mockOnSubmit} />,
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
