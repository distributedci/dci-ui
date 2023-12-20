import http from "services/http";
import * as types from "./currentUserActionsTypes";
import { showAPIError, showSuccess } from "alerts/alertsActions";
import { ICurrentUser, IUser } from "types";
import { AppThunk } from "store";
import { AxiosPromise } from "axios";

export function setIdentity(identity: ICurrentUser) {
  return {
    type: types.SET_IDENTITY,
    identity,
  };
}

interface IUpdateCurrentUser {
  user: IUser;
}

export function updateCurrentUser(
  currentUser: ICurrentUser,
): AppThunk<AxiosPromise<IUpdateCurrentUser>> {
  return (dispatch) => {
    return http({
      method: "put",
      url: "/api/v1/identity",
      data: currentUser,
      headers: { "If-Match": currentUser.etag },
    })
      .then((response) => {
        dispatch({
          type: types.UPDATE_CURRENT_USER,
          currentUser: response.data.user,
        });
        dispatch(showSuccess("Your settings has been updated successfully"));
        return response;
      })
      .catch((error) => {
        dispatch(showAPIError(error));
        return error;
      });
  };
}

export function deleteCurrentUser() {
  return {
    type: types.DELETE_CURRENT_USER,
  };
}
