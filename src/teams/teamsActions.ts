import http from "services/http";
import { createActions } from "api/apiActions";
import { AxiosPromise } from "axios";
import { IProduct, ITeam, IUser } from "types";
import { AppThunk } from "store";
import { showAPIError, showSuccess } from "alerts/alertsActions";

export default createActions("team");

export function fetchUsersForTeam(team: ITeam): Promise<IUser[]> {
  return http
    .get(`/api/v1/teams/${team.id}/users`)
    .then((response) => response.data.users);
}

export function grantTeamPermission(
  team: ITeam,
  product: IProduct,
): AxiosPromise<void> {
  return http({
    method: "post",
    url: `/api/v1/products/${product.id}/teams`,
    data: { team_id: team.id },
  });
}

export function grantTeamProductPermission(
  team: ITeam,
  product: IProduct,
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return grantTeamPermission(team, product)
      .then((response) => {
        dispatch(
          showSuccess(
            `${team.name} can download components for the product ${product.name}`,
          ),
        );
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
        return error;
      });
  };
}

export function removeTeamProductPermission(
  team: ITeam,
  product: IProduct,
): AppThunk<AxiosPromise<void>> {
  return (dispatch) => {
    return http({
      method: "delete",
      url: `/api/v1/products/${product.id}/teams/${team.id}`,
    })
      .then((response) => {
        dispatch(
          showSuccess(
            `${team.name} to ${product.name} permission successfully removed`,
          ),
        );
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
        return error;
      });
  };
}
