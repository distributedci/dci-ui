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
import { getGlobalStatus } from "services/globalStatus/actions";
import { getUniqueProductsNames } from "services/globalStatus";

class Ctrl {
  constructor($scope, $ngRedux, $state, $stateParams) {
    this.$ngRedux = $ngRedux;
    this.$stateParams = $stateParams;
    this.$state = $state;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.loading = true;
    this.tab = this.$stateParams.tab || "all";
    this.tabs = ["all"];
    this.$ngRedux.dispatch(getGlobalStatus()).then(globalStatus => {
      this.tabs = this.tabs.concat(getUniqueProductsNames(globalStatus));
      this.loading = false;
    });
  }

  setTab(tab) {
    this.tab = tab;
    this.$state.go("auth.globalStatus", { tab });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$state", "$stateParams"];

export default Ctrl;
