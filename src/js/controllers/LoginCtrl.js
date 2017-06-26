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

require("app").controller("LoginCtrl", [
  "$scope",
  "$state",
  "auth",
  "messages",
  function($scope, $state, auth, messages) {
    $scope.authenticate = function() {
      auth
        .login($scope.username, $scope.password)
        .then(function() {
          $state.go("index");
        })
        .catch(function(err) {
          if (err.status === 401) {
            messages.alert("Invalid username or password.", "danger");
          } else {
            messages.generalError();
          }
        });
    };
  }
]);
