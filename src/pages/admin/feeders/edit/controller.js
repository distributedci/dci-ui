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
import { stateGo } from "redux-ui-router";
import * as alertsActions from "services/alerts/actions";
import * as feedersActions from "services/feeders/actions";

class Ctrl {
  constructor($scope, $ngRedux, $uibModal) {
    this.$ngRedux = $ngRedux;
    this.$uibModal = $uibModal;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    const id = this.$ngRedux.getState().router.currentParams.id;
    this.$ngRedux.dispatch(api("feeder").get({ id })).then(response => {
      this.feeder = response.data.feeder;
    });
    this.$ngRedux.dispatch(api("team").all());
  }

  update() {
    this.$ngRedux.dispatch(api("feeder").put(this.feeder)).then(() => {
      this.$ngRedux.dispatch(
        alertsActions.success(
          `feeder ${this.feeder.name} updated successfully`
        )
      );
      this.$ngRedux.dispatch(stateGo("auth.adminFeeders"));
    });
  }

  refreshApiSecretConfirmed() {
    this.$ngRedux
      .dispatch(feedersActions.refreshApiSecret(this.feeder))
      .then(feeder => {
        this.$ngRedux.dispatch(
          alertsActions.success("feeder api secret has been refreshed")
        );
        this.feeder = feeder;
      });
  }

  refreshApiSecret() {
    const refreshApiSecretModal = this.$uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Refresh feeder api secret",
            body: "Are you you want to refresh feeeder api secret?",
            okButton: "Yes refresh it",
            cancelButton: "oups no!"
          };
        }
      }
    });
    refreshApiSecretModal.result.then(
      this.refreshApiSecretConfirmed.bind(this)
    );
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$uibModal"];

export default Ctrl;
