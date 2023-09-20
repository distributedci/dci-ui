import axios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import axiosMockAdapter from "axios-mock-adapter";
import {
  getProductsTeamHasAccessTo,
  grantTeamProductPermission,
  removeTeamProductPermission,
} from "./teamsActions";
import { ITeam } from "types";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const axiosMock = new axiosMockAdapter(axios);

test("getProductsTeamHasAccessTo", () => {
  const team = { id: "t1", name: "Team 1" } as ITeam;
  axiosMock.onGet("https://api.distributed-ci.io/api/v1/products").reply(200, {
    products: [
      { id: "p1", name: "RHEL" },
      { id: "p2", name: "OpenStack" },
    ],
    _meta: { count: 2 },
  });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p1/teams")
    .reply(200, { teams: [team], _meta: { count: 1 } });
  axiosMock
    .onGet("https://api.distributed-ci.io/api/v1/products/p2/teams")
    .reply(200, { teams: [], _meta: { count: 1 } });
  const store = mockStore();
  return store.dispatch(getProductsTeamHasAccessTo(team)).then((products) => {
    expect(products[0].id).toBe("p1");
    expect(products.length).toBe(1);
  });
});

test("grantTeamProductPermission", () => {
  const data = { team_id: "t1" };
  axiosMock
    .onPost("https://api.distributed-ci.io/api/v1/products/p1/teams", data)
    .reply(201);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const product = { id: "p1" };
  return store
    .dispatch(grantTeamProductPermission(team, product))
    .then((response) => expect(response.status).toBe(201));
});

test("removeTeamProductPermission", () => {
  axiosMock
    .onDelete("https://api.distributed-ci.io/api/v1/products/p1/teams/t1")
    .reply(204);
  const store = mockStore();
  const team = { id: "t1", name: "Team 1" };
  const product = { id: "p1", etag: "ep1" };
  return store
    .dispatch(removeTeamProductPermission(team, product))
    .then((response) => expect(response.status).toBe(204));
});
