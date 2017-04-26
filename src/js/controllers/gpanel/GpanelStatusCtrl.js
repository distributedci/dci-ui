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

require("app").controller("GpanelStatusCtrl", [
  "$scope",
  "$stateParams",
  "api",
  "status",
  function($scope, $stateParams, api, status) {
    var topic = $stateParams.id;
    var componentType = ($scope.componentType = $stateParams.componentType);
    $scope.jobs_ = [];
    $scope.display = 0;

    $scope.status = function(s) {
      return ["label", "label-" + _.get(status, [s, "color"])];
    };

    $scope.collapse = function(component, jobs) {
      $scope.display = component;
      $scope.jobs_ = jobs;
    };

    api.topics.get(topic).then(_.partial(_.set, $scope, "topic"));
    api.topics.jobdefinitions(topic).then(_.partial(_.set, $scope, "jobdefs"));

    function setupJobsStatus(component) {
      api.topics.components.jobs(topic, component.id).then(function(jobs) {
        _.each(jobs, function(job) {
          var path = ["jobs", component.id, job.jobdefinition_id, job.status];
          _.update($scope, path, function(target) {
            return _.concat(target || [], job);
          });
        });
      });
      return component;
    }

    // $scope is inherited, we can access "q" from GpanelTopicCtrl
    $scope.q.then(function() {
      $scope.components = _($scope.components)
        .filter(["type", componentType])
        .map(setupJobsStatus)
        .value();
    });
  }
]);
