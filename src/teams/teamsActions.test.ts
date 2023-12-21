import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";
import {
  grantTeamProductPermission,
  removeTeamProductPermission,
} from "./teamsActions";
import { IProduct, ITeam } from "types";
import { AppDispatch } from "store";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const axiosMock = new axiosMockAdapter(axios);

test("grantTeamProductPermission", () => {
  const data = { team_id: "t1" };
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/products/p1/teams", data)
    .reply(201);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" } as ITeam;
  const product = { id: "p1" } as IProduct;
  const dispatch = store.dispatch as AppDispatch;
  return dispatch(grantTeamProductPermission(team, product)).then((response) =>
    expect(response.status).toBe(201),
  );
});

test("removeTeamProductPermission", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/products/p1/teams/t1")
    .reply(204);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" } as ITeam;
  const product = { id: "p1", etag: "ep1" } as IProduct;
  const dispatch = store.dispatch as AppDispatch;
  return dispatch(removeTeamProductPermission(team, product)).then((response) =>
    expect(response.status).toBe(204),
  );
});
