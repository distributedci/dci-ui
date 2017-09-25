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

import { stateGo } from "redux-ui-router";
import api from "services/api";
import * as alertsActions from "services/alerts/actions";
import * as jobsActions from "services/jobs/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.seeDetails = false;
  }

  open(job, page) {
    this.$ngRedux.dispatch(api("job").actions.set(job));
    this.$ngRedux.dispatch(stateGo(page, job));
  }

  save(job) {
    this.$ngRedux.dispatch(api("job").put(job)).then(() => {
      this.$ngRedux.dispatch(
        alertsActions.success("comment updated successfully")
      );
    });
  }

  addMeta(job, meta) {
    if (!meta.value) {
      meta.value = "1";
    }
    this.$ngRedux.dispatch(jobsActions.createMeta(job, meta)).then(() => {
      this.$scope.$apply();
      this.meta = { value: "", name: "" };
      this.$ngRedux.dispatch(
        alertsActions.success("meta created successfully")
      );
    });
  }

  deleteMeta(job, meta) {
    this.$ngRedux.dispatch(jobsActions.deleteMeta(job, meta)).then(() => {
      this.$scope.$apply();
      this.$ngRedux.dispatch(
        alertsActions.success("meta deleted successfully")
      );
    });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
