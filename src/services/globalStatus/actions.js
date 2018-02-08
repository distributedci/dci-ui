// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import http from "services/http";
import * as constants from "./constants";

export function setGlobalStatus(globalStatus) {
  return {
    type: constants.SET_GLOBAL_STATUS,
    payload: globalStatus
  };
}

export function getGlobalStatus() {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/global_status`
    };
    return http(request).then(response => {
      return dispatch(setGlobalStatus(response.data));
    });
  };
}
