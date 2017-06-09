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

describe("login controller", function() {
  var $controller;

  beforeEach(
    inject(function(_$controller_) {
      $controller = _$controller_;
    })
  );

  it("should authenticate the user", function() {
    var $scope = {};
    $controller("LoginCtrl", { $scope: $scope });
    $httpBackend
      .expectGET(
        "https://api.example.org/api/v1/users?where=name:test&embed=team,role"
      )
      .respond();
    $scope.authenticate({ username: "test", password: "password" });
    $httpBackend.flush();
  });
});
