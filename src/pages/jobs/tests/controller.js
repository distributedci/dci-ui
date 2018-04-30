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

import api from "services/api";
import * as jobsActions from "services/jobs/actions";
import * as testsFilters from "./testsFilters";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.filters = {
      regression: false,
      passed: false,
      skipped: false,
      error: false,
      failure: false
    };
    const id = this.$ngRedux.getState().router.currentParams.id;
    this.$ngRedux
      .dispatch(
        api("job").get(
          { id },
          {
            embed: "results,remoteci,components,jobstates,metas,topic"
          }
        )
      )
      .then(response => {
        this.$ngRedux
          .dispatch(jobsActions.retrieveTests(response.data.job))
          .then(job => {
            this.job = job;
            this.$scope.$apply();
          });
      });
  }

  filterTestsCases(filters) {
    return testsFilters.filterTestsCases(filters);
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
