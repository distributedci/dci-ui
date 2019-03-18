import reducer from "./currentUserReducer";
import * as types from "./currentUserActionsTypes";

it("SET_IDENTITY", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      name: "identity",
      teams: {
        t1: {
          parent_id: null,
          role: "SUPER_ADMIN",
          team_name: "admin"
        }
      }
    }
  });
  expect(newState).toEqual({
    hasProductOwnerRole: true,
    hasReadOnlyRole: true,
    id: "i1",
    isReadOnly: false,
    isSuperAdmin: true,
    name: "identity",
    teams: {
      t1: { parent_id: null, role: "SUPER_ADMIN", team_name: "admin" }
    },
    team: { parent_id: null, role: "SUPER_ADMIN", team_name: "admin" }
  });
});

it("SET_ACTIVE_TEAM", () => {
  const newState = reducer(
    {
      hasProductOwnerRole: true,
      hasReadOnlyRole: true,
      id: "i1",
      isReadOnly: false,
      isSuperAdmin: true,
      name: "identity",
      teams: {
        t1: { parent_id: null, role: "SUPER_ADMIN", team_name: "admin" },
        t2: { parent_id: "t1", role: "PRODUCT_OWNER", team_name: "OpenStack" }
      },
      team: { parent_id: null, role: "SUPER_ADMIN", team_name: "admin" }
    },
    {
      type: types.SET_ACTIVE_TEAM,
      team: { parent_id: "t1", role: "PRODUCT_OWNER", team_name: "OpenStack" }
    }
  );
  expect(newState).toEqual({
    hasProductOwnerRole: true,
    hasReadOnlyRole: true,
    id: "i1",
    isReadOnly: false,
    isSuperAdmin: false,
    name: "identity",
    teams: {
      t1: { parent_id: null, role: "SUPER_ADMIN", team_name: "admin" },
      t2: { parent_id: "t1", role: "PRODUCT_OWNER", team_name: "OpenStack" }
    },
    team: { parent_id: "t1", role: "PRODUCT_OWNER", team_name: "OpenStack" }
  });
});

it("set SUPER_ADMIN role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t1: {
          parent_id: null,
          role: "SUPER_ADMIN",
          team_name: "admin"
        }
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(true);
  expect(newState.isReadOnly).toBe(false);
});

it("set PRODUCT_OWNER role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: "t1",
          role: "PRODUCT_OWNER",
          team_name: "OpenStack"
        }
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(true);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(false);
});

it("set READ_ONLY_USER role shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: "t1",
          role: "READ_ONLY_USER",
          team_name: "Red Hat"
        }
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(true);
});

it("SET_IDENTITY unset role shortcut", () => {
  const newState = reducer(
    {
      hasProductOwnerRole: true,
      hasReadOnlyRole: true,
      isSuperAdmin: true,
      isReadOnly: false
    },
    {
      type: types.SET_IDENTITY,
      identity: {
        id: "i1",
        email: "currentUser@example.org",
        teams: {
          t2: {
            parent_id: "t1",
            role: "READ_ONLY_USER",
            team_name: "Red Hat"
          }
        }
      }
    }
  );
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(true);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(true);
});

it("SET_IDENTITY USER shortcut", () => {
  const newState = reducer(undefined, {
    type: types.SET_IDENTITY,
    identity: {
      id: "i1",
      email: "currentUser@example.org",
      teams: {
        t2: {
          parent_id: null,
          role: "USER",
          team_name: null
        }
      }
    }
  });
  expect(newState.email).toBe("currentUser@example.org");
  expect(newState.hasProductOwnerRole).toBe(false);
  expect(newState.hasReadOnlyRole).toBe(false);
  expect(newState.isSuperAdmin).toBe(false);
  expect(newState.isReadOnly).toBe(false);
});

it("deleteCurrentUser", () => {
  const newState = reducer(
    {
      id: "u1"
    },
    {
      type: types.DELETE_CURRENT_USER
    }
  );
  expect(newState).toEqual({});
});

it("subscribe to a remoteci", () => {
  const newState = reducer(
    {
      remotecis: []
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1"
      }
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("subscribe to a remoteci in remotecis", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r2" }]
    },
    {
      type: types.SUBSCRIBED_TO_A_REMOTECI,
      remoteci: {
        id: "r1"
      }
    }
  );
  expect(newState.remotecis[0].id).toBe("r1");
});

it("unsubscribe from a remoteci", () => {
  const newState = reducer(
    {
      remotecis: [{ id: "r1" }, { id: "r2" }, { id: "r3" }]
    },
    {
      type: types.UNSUBSCRIBED_FROM_A_REMOTECI,
      remoteci: {
        id: "r2"
      }
    }
  );
  expect(newState.remotecis).toEqual([{ id: "r1" }, { id: "r3" }]);
});
