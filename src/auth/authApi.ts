import type { ICurrentUser, IIdentity, IIdentityTeam } from "types";
import { api } from "api";
import {
  getDefaultTeam,
  removeDefaultTeam,
} from "admin/teams/teamLocalStorage";

const ADMIN_TEAM_NAME = "admin";
const EPM_TEAM_NAME = "EPM";
const RED_HAT_TEAM_NAME = "Red Hat";

function buildShortcut(team: IIdentityTeam | null) {
  if (team === null) {
    return {
      isSuperAdmin: false,
      hasEPMRole: false,
      hasReadOnlyRole: false,
      isReadOnly: false,
    };
  }
  return {
    isSuperAdmin: team.name === ADMIN_TEAM_NAME,
    hasEPMRole: team.name === ADMIN_TEAM_NAME || team.name === EPM_TEAM_NAME,
    hasReadOnlyRole:
      team.name === ADMIN_TEAM_NAME ||
      team.name === EPM_TEAM_NAME ||
      team.name === RED_HAT_TEAM_NAME,
    isReadOnly: team.name === RED_HAT_TEAM_NAME,
  };
}

function _hasAdminPrivilege(team: IIdentityTeam) {
  return team.name === ADMIN_TEAM_NAME || team.name === EPM_TEAM_NAME;
}

function _getDisplayName(team: IIdentityTeam) {
  switch (team.name) {
    case ADMIN_TEAM_NAME:
      return "Admin team";
    case EPM_TEAM_NAME:
      return "Moderation team";
    default:
      return team.name;
  }
}

export function buildCurrentUser(
  identity: IIdentity,
  defaultTeam: IIdentityTeam | null,
): ICurrentUser {
  const teams = Object.values(identity.teams)
    .filter((team) => team.id !== null)
    .map((team) => ({
      ...team,
      hasAdminPrivileges: _hasAdminPrivilege(team),
      displayName: _getDisplayName(team),
    }));
  const firstTeam = teams.length === 0 ? null : teams[0];
  const team =
    defaultTeam && defaultTeam.id in identity.teams
      ? {
          ...defaultTeam,
          hasAdminPrivileges: _hasAdminPrivilege(defaultTeam),
          displayName: _getDisplayName(defaultTeam),
        }
      : firstTeam;
  return {
    ...identity,
    teams,
    team,
    ...buildShortcut(team),
  };
}

function getDefaultTeamWithIdentity(identity: IIdentity) {
  const defaultTeam = getDefaultTeam();
  if (defaultTeam && defaultTeam.id in identity.teams) {
    return defaultTeam;
  }
  removeDefaultTeam();
  return null;
}

export const authApi = api
  .enhanceEndpoints({ addTagTypes: ["Auth"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCurrentUser: builder.query<ICurrentUser, void>({
        query: () => "/identity",
        transformResponse: (response: { identity: IIdentity }) => {
          const identity = response.identity;
          const defaultTeam = getDefaultTeamWithIdentity(identity);
          return buildCurrentUser(identity, defaultTeam);
        },
        transformErrorResponse: () => undefined,
      }),
    }),
  });

export const { useGetCurrentUserQuery } = authApi;
