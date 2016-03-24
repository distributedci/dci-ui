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

'use strict';

require('app')
.controller('LoginCtrl', [
  '$scope', '$state', 'auth', function($scope, $state, auth) {
    $scope.authenticate = function(credentials) {
      auth.login(credentials.username, credentials.password).then(
        function() {
          $state.go('index');
        },
        function(err) {
          $scope.err = err.data;
        }
      );
    };
  }
])

.controller('InformationCtrl', [
  '$scope',  'teams', 'topics', 'remotecis',
  function($scope, teams, topics, remotecis) {
    $scope.teams = teams;
    $scope.topics = topics;
    $scope.remotecis = remotecis;
  }
])
.controller('ListJobsCtrl', [
  '$injector', '$scope', 'jobs', 'remotecis', 'page',
  function($injector, $scope, jobs, remotecis, page) {
    var $state = $injector.get('$state');
    var statuses = ['failure', 'success', 'running', 'new',
                    'pre-run', 'post-run'];
    $scope.jobs = jobs.jobs;
    $scope.remotecis = {};
    $scope.status = {};
    _.each(statuses, function(status) {
      $scope.status[status] = _.includes($state.params.status, status);
    });

    _.each(remotecis, function(remoteci) {
      var remoteci = remoteci.name;
      $scope.remotecis[remoteci] = _.includes($state.params.remoteci, remoteci);
    });

    $scope.search = function() {
      var params = {
        'status': _($scope.status).pick(_.identity).keys().join(','),
        'remoteci': _($scope.remotecis).pick(_.identity).keys().join(',')
      };
      $state.go('jobs', params);
    };

    $scope.isFiltering = true;

    if (!$scope.isFiltering) {
      $scope.pagination = {
        total: jobs._meta.count, page: page,
        pageChanged: function() {
          $state.go('jobs', $scope.pagination);
        }
      };
    }
  }
]);
