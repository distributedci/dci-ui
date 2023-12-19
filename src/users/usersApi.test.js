import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";
import { fetchUserTeams } from "./usersApi";

const axiosMock = new axiosMockAdapter(axios);

test("fetchUserTeams", () => {
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/users/abc/teams")
    .reply(200);
  return fetchUserTeams({ id: "abc" });
});
