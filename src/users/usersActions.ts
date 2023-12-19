import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { ITeam, IUser } from "types";

export default createActions("user");

export function addUserToTeam(
  user_id: string,
  team: ITeam,
): AxiosPromise<void> {
  return http.post(`/api/v1/teams/${team.id}/users/${user_id}`, {});
}

export function deleteUserFromTeam(
  user: IUser,
  team: ITeam,
): AxiosPromise<void> {
  return http.delete(`/api/v1/teams/${team.id}/users/${user.id}`);
}
