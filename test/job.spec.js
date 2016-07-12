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

var utils  = require('./utils');
var api    = require('./api');
var config = require('../config');
var Q      = require('q');

/*globals describe, it, expect, element, browser*/
describe('DCI homepage', function() {

  beforeEach(function() {
    var promise;
    var cookie = JSON.stringify({
      status: 2,
      team: {name: 'admin'},
      token: Buffer('admin:admin', 'binary').toString('base64')
    });
    browser.get('/');
    promise = browser.manage().addCookie('user', encodeURIComponent(cookie));
    promise.then(utils.noop, utils.noop);
  });

  beforeEach(function(done) {
    // create a job before launching test
    api.job().then(done);
  });

  afterEach(function(done) {
    // take advantage of the cascading deletion, topic removal will also remove
    // components, jobs, jobdefinitions
    api.topic.cache.get()
      .then(function(topic) {
        return topic.remove();
      })
      .then(function() {
        return api.remoteci.cache.get();
      })
      .then(function(remoteci) {
        return remoteci.remove();
      })
      .then(done);
  });

  it('should be possible to recheck a job', function() {
    browser.get('/#/jobs');
    element(by.css('.glyphicon-repeat')).click();
    expect(browser.getLocationAbsUrl()).toMatch('/jobs/[a-z0-9-]+/results$');
  });
});
