import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { ITeam } from "types";
import SearchJob from "./SearchJob";


interface GetTeams {
  data: {
    teams: ITeam[];
  };
}

const getTeams = () =>
  jest.fn().mockResolvedValue({
    data: [
      {
        id: "t1",
        name: "Team 1",
      },
      {
        id: "t2",
        name: "Team 2",
      },
    ] as ITeam[],
  });

test("When a user start typing `t` in the search box display team: and topic: in the listbox", () => {
  render(<SearchJob getTeams={getTeams} />);
  const searchInput = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(searchInput, { target: { value: "t" } });

  const listbox = screen.getByRole("listbox");
  expect(listbox).toBeVisible();

  const listboxItems = screen.getAllByRole("option") as HTMLOptionElement[];
  expect(listboxItems.length).toBe(2);

  expect(listboxItems[0].innerHTML).toBe("team:");
  expect(listboxItems[1].innerHTML).toBe("topic:");
});
