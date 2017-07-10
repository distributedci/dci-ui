// Copyright 2015 Red Hat, Inc.
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

"use strict";

require("app").component("settingsPage", {
  templateUrl: "/partials/pages/settings.html",
  controller: ["$state", "messages", "user", "moment", settingsPageCtrl]
});

function settingsPageCtrl($state, messages, user, moment) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.user = user;
    $ctrl.timezones = moment.tz.names();
  };

  $ctrl.onSuccess = function(message) {
    messages.alert(message, "success");
    $state.reload();
  };

  $ctrl.onError = function(message) {
    messages.alert(message, "danger");
  };
}
