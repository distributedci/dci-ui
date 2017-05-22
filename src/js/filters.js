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

require("app")
  .filter("limit", function() {
    return function(input, size, term) {
      if (size && input.length > size) {
        input = input.slice(0, size) + (term ? term : "");
      }
      return input;
    };
  })
  .filter("dciDate", [
    "$filter",
    function($filter) {
      var amDateFormat = $filter("amDateFormat");
      return function(value) {
        return amDateFormat(value, "dddd DD, MMMM h:mm:ss A");
      };
    }
  ])
  .filter("msToSec", [
    "$filter",
    function() {
      return function(value) {
        return Math.round(value / 1000);
      };
    }
  ]);
