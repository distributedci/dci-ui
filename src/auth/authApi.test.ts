import type { ITeam } from "types";
import { buildCurrentUser } from "./authApi";

test("buildCurrentUser without a default team return the first team", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
            name: "Team 1",
          } as ITeam,
          t2: {
            id: "t2",
            name: "Team 2",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      null,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [
      {
        displayName: "Team 1",
        hasAdminPrivileges: false,
        id: "t1",
        name: "Team 1",
      },
      {
        displayName: "Team 2",
        hasAdminPrivileges: false,
        id: "t2",
        name: "Team 2",
      },
    ],
    timezone: "UTC-04",
    team: {
      displayName: "Team 1",
      hasAdminPrivileges: false,
      id: "t1",
      name: "Team 1",
    },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildCurrentUser with a default team return this team", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
            name: "Team 1",
          } as ITeam,
          t2: {
            id: "t2",
            name: "Team 2",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      {
        id: "t2",
        name: "Team 2",
      } as ITeam,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [
      {
        displayName: "Team 1",
        hasAdminPrivileges: false,
        id: "t1",
        name: "Team 1",
      },
      {
        displayName: "Team 2",
        hasAdminPrivileges: false,
        id: "t2",
        name: "Team 2",
      },
    ],
    timezone: "UTC-04",
    team: {
      displayName: "Team 2",
      hasAdminPrivileges: false,
      id: "t2",
      name: "Team 2",
    },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});

test("buildCurrentUser remove an old team the user doesn't have access to anymore", () => {
  expect(
    buildCurrentUser(
      {
        email: "test@example.org",
        etag: "e1",
        fullname: "Current User",
        id: "i1",
        name: "currentUser",
        teams: {
          t1: {
            id: "t1",
            name: "Team 1",
          } as ITeam,
          t2: {
            id: "t2",
            name: "admin",
          } as ITeam,
        },
        timezone: "UTC-04",
      },
      {
        id: "t3",
        name: "Team 3",
      } as ITeam,
    ),
  ).toEqual({
    email: "test@example.org",
    etag: "e1",
    fullname: "Current User",
    id: "i1",
    name: "currentUser",
    teams: [
      {
        displayName: "Team 1",
        hasAdminPrivileges: false,
        id: "t1",
        name: "Team 1",
      },
      {
        displayName: "Admin team",
        hasAdminPrivileges: true,
        id: "t2",
        name: "admin",
      },
    ],
    timezone: "UTC-04",
    team: {
      displayName: "Team 1",
      hasAdminPrivileges: false,
      id: "t1",
      name: "Team 1",
    },
    isSuperAdmin: false,
    hasEPMRole: false,
    hasReadOnlyRole: false,
    isReadOnly: false,
  });
});
