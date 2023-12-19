import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { addUserToTeam, deleteUserFromTeam } from "./usersActions";

const axiosMock = new axiosMockAdapter(axios);

test("addUserToTeam", () => {
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/teams/def/users/abc", {})
    .reply(201);
  const team = { id: "def" };
  return addUserToTeam("abc", team);
});

test("deleteUserFromTeam", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/teams/def/users/abc")
    .reply(204);
  const user = { id: "abc" };
  const team = { id: "def" };
  return deleteUserFromTeam(user, team);
});
