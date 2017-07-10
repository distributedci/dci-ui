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

var _ = require("lodash");

require("app").factory("api", [
  "$q",
  "$http",
  "$window",
  "user",
  "config",
  function($q, $http, $window, user, config) {
    var api = {
      promise: null,
      config: null,
      endpoints: [
        "jobs",
        "remotecis",
        "jobstates",
        "files",
        "users",
        "teams",
        "components",
        "jobdefinitions",
        "audits",
        "topics",
        "metrics",
        "roles"
      ]
    };

    var urlize = _.rest(_.partialRight(_.join, "/"));
    var urlPttrn = new RegExp("(https?://)(.*)");

    // Initialize an API object which consists into a simple javascript
    // object, containing all the endpoints and then the methods associated
    // Here is a quick example:
    //
    // api = {
    //  jobs: {
    //    url: "https://api.distributed-ci.io/api/v1/jobs/"
    //    get: function... ,
    //    create: function... ,
    //    list: function... ,
    //    remove: function... ,
    //    update: function...
    //  },
    //  remotecis: {
    //    ...
    //  }
    // }
    api.endpoints.forEach(function(endpoint) {
      api[endpoint] = {
        url: config.apiURL + "/api/v1/" + endpoint,
        get: function(id) {
          // remove the trailing "s"
          var extract = "data." + endpoint.slice(0, endpoint.length - 1);
          var conf = this.embed ? { params: { embed: this.embed } } : {};
          return $http
            .get(urlize(this.url, id), conf)
            .then(_.property(extract));
        },
        remove: function(id, etag) {
          var conf = { headers: { "If-Match": etag } };
          return $http.delete(urlize(this.url, id), conf);
        },
        create: function(obj) {
          // remove the trailing "s"
          var extract = "data." + endpoint.slice(0, endpoint.length - 1);
          return $http.post(this.url, obj).then(_.property(extract));
        },
        list: function(page, extract) {
          var params = _.assign(
            page ? { limit: 20, offset: 20 * (page - 1) } : {},
            this.embed ? { embed: this.embed } : {}
          );
          extract = extract ? "data." + endpoint : "data";
          return $http
            .get(this.url, { params: params })
            .then(_.property(extract));
        },
        update: function(obj) {
          var url = urlize(this.url, obj.id);
          var headers = { headers: { "If-Match": obj.etag } };
          // parse method call is a bit crapy but it is more expressive
          if (_.isEmpty((obj = this.update.parse(obj)))) {
            return $q.reject("empty");
          } else {
            return $http.put(url, obj, headers);
          }
        }
      };
    });

    // add the search endpoint
    api.search = {
      url: config.apiURL + "/api/v1/search"
    };

    // add the issues endpoint
    api.issues = {};

    /*                                COMPONENTS                                */
    api.components.update.parse = _.partialRight(_.pick, ["export_control"]);

    api.components.files = function(component) {
      var url = urlize(this.url, component, "files");
      return $http.get(url).then(_.property("data.component_files"));
    };

    /*                              JOBDEFINITIONS                              */
    api.jobdefinitions.components = function(jobdef) {
      var url = urlize(this.url, jobdef, "components");
      return $http.get(url).then(_.property("data.components"));
    };
    api.jobdefinitions.tests = function(jobdef) {
      var url = urlize(this.url, jobdef, "tests");
      return $http.get(url).then(_.property("data.tests"));
    };

    /*                                  AUDITS                                  */
    api.audits.list = function(page, extract) {
      // Audits does not provide the common api features, so we make a
      // simple call here.
      extract = extract ? "data.audits" : "data";
      return $http.get(this.url).then(_.property(extract));
    };

    /*                                REMOTE CIS                                */
    api.remotecis.update.parse = _.partialRight(_.pick, [
      "name",
      "state",
      "allow_upgrade_job",
      "data"
    ]);
    api.remotecis.create = function(remoteci) {
      return $http
        .post(this.url, _.merge(remoteci, { team_id: user.team.id }))
        .then(_.property("data.remoteci"));
    };
    api.remotecis.tests = function(remoteci) {
      var url = urlize(api.remotecis.url, remoteci, "tests");
      return $http.get(url).then(_.property("data.tests"));
    };
    api.remotecis.refreshApiSecret = function(remoteci) {
      var url = urlize(api.remotecis.url, remoteci.id, "api_secret");
      var headers = { headers: { "If-Match": remoteci.etag } };
      return $http.put(url, {}, headers).then(_.property("data"));
    };

    /*                                  TEAMS                                   */
    api.teams.update.parse = _.partialRight(_.pick, [
      "name",
      "email",
      "notification"
    ]);

    /*                                  USERS                                   */
    api.users.embed = "team,role";
    api.users.getByName = function(name, withoutTeam) {
      var conf = _.assign(
        { where: "name:" + name },
        withoutTeam ? {} : { embed: "team,role" }
      );
      return $http
        .get(urlize(this.url), { params: conf })
        .then(_.property("data.users[0]"));
    };
    api.users.update.parse = _.partialRight(_.pick, [
      "name",
      "fullname",
      "email",
      "team_id",
      "password",
      "role_id"
    ]);

    /*                               CURRENT USER                               */

    api.current_user = {
      update: function(data) {
        var url = config.apiURL + "/api/v1/users/me";
        var headers = { headers: { "If-Match": user.etag } };
        var parse = _.partialRight(_.pick, [
          "fullname",
          "email",
          "timezone",
          "current_password",
          "new_password"
        ]);
        return $http.put(url, parse(data), headers);
      }
    };

    /*                                  TOPICS                                  */
    api.topics.update.parse = _.partialRight(_.pick, ["name", "next_topic"]);
    api.topics.teams = function(id) {
      var url = urlize(api.topics.url, id, "teams");
      return $http.get(url).then(_.property("data.teams"));
    };
    api.topics.teams.post = function(id, team) {
      var url = urlize(api.topics.url, id, "teams");
      return $http.post(url, { team_id: team });
    };
    api.topics.teams.remove = function(id, team) {
      var url = urlize(api.topics.url, id, "teams", team);
      return $http.delete(url);
    };
    api.topics.components = function(topic_id) {
      var url = urlize(api.topics.url, topic_id, "components");
      var conf = { params: { embed: "files" } };
      return $http.get(url, conf).then(_.property("data.components"));
    };
    api.topics.jobdefinitions = function(topic) {
      var url = urlize(api.topics.url, topic, "jobdefinitions");
      return $http.get(url).then(_.property("data.jobdefinitions"));
    };
    api.topics.jobs = function(topic_id) {
      return api.topics.jobdefinitions(topic_id).then(function(jobDefinition) {
        var jobdefinition_type =
          encodeURI(jobDefinition[0]["component_types"][0]) || "puddle_osp";
        var url = urlize(
          api.topics.url,
          topic_id,
          "type/" + jobdefinition_type + "/status"
        );
        return $http.get(url).then(_.property("data.jobs"));
      });
    };

    /*                                JOBSTATES                                 */
    api.jobstates.list = function(page, extract) {
      var conf = { params: { embed: "job" } };
      extract = extract ? "data.jobstates" : "data";
      return $http.get(this.url, conf).then(_.property(extract));
    };

    /*                                   JOBS                                   */
    api.jobs.embed = "remoteci,jobdefinition,jobdefinition.tests,results";
    api.jobs.update.parse = _.partialRight(_.pick, ["status", "comment"]);

    api.jobs.results = function(job) {
      var url = urlize(this.url, job, "results");
      return $http.get(url).then(_.property("data.results"));
    };
    api.jobs.files = function(job) {
      var url = urlize(this.url, job, "files");
      return $http.get(url).then(_.property("data.files"));
    };
    api.jobs.metas = function(job) {
      var url = urlize(api.jobs.url, job, "metas");
      return $http.get(url).then(_.property("data.metas"));
    };
    api.jobs.metas.post = function(job, data) {
      var url = urlize(api.jobs.url, job.id, "metas");
      return $http.post(url, data);
    };
    api.jobs.metas.delete = function(job, id) {
      var url = urlize(api.jobs.url, job, "metas", id);
      return $http.delete(url);
    };
    api.issues.list = function(job) {
      var url = urlize(api.jobs.url, job, "issues");
      return $http.get(url).then(_.property("data.issues"));
    };

    api.issues.create = function(job, issue) {
      var url = urlize(api.jobs.url, job, "issues");
      return $http
        .post(url, { url: issue })
        .then(_.partial(api.issues.list, job));
    };

    api.issues.remove = function(job, id, etag) {
      var url = urlize(api.jobs.url, job, "issues", id);
      return $http.delete(url, { headers: { "If-Match": etag } });
    };

    api.jobs.get = function(job, partial) {
      if (partial) {
        return $http.get(urlize(this.url, job)).then(_.property("data.job"));
      }

      var confJ = { params: { embed: "remoteci,jobdefinition,results" } };
      var confJS = {
        params: {
          sort: "created_at,files.created_at",
          embed: "files"
        }
      };
      return $q
        .all([
          $http.get(urlize(this.url, job), confJ),
          $http.get(urlize(this.url, job, "components")),
          $http.get(urlize(this.url, job, "files")),
          $http.get(urlize(this.url, job, "jobstates"), confJS)
        ])
        .then(function(results) {
          var job = _.first(results).data.job;
          job.components = results[1].data.components;
          var files = results[2].data.files;
          job.files = files;
          _.each(files, function(file) {
            file.dl_link = api.files.url.replace(urlPttrn, function(_, g1, g2) {
              var token = $window.atob(user.token);
              var tkn_index = token.indexOf(":");
              var tkn_username = token.substring(0, tkn_index);
              var tkn_password = encodeURIComponent(
                token.substring(tkn_index + 1)
              );

              return urlize(
                g1 + tkn_username + ":" + tkn_password + "@" + g2,
                file.id,
                "content"
              );
            });
          });
          job.jobstates = _.last(results).data.jobstates;
          return job;
        });
    };
    api.jobs.list = function(page, statuses) {
      var params = {
        embed: this.embed,
        limit: 20,
        offset: 20 * (page - 1)
      };

      if (statuses.length > 0) {
        var statusPromises = [];
        for (var i = 0; i < statuses.length; i++) {
          params.where = "status:" + statuses[i];
          statusPromises.push(
            $http.get(this.url, { params: _.assign({}, params) })
          );
        }
        return $q.all(statusPromises).then(function(values) {
          var jobs = [];
          var count = 0;
          for (var j = 0; j < values.length; j++) {
            jobs = jobs.concat(values[j].data.jobs);
            count += values[j].data._meta.count;
          }
          return { _meta: { count: count }, jobs: jobs };
        });
      }

      return $http.get(this.url, { params: params }).then(_.property("data"));
    };

    /*                                JOBSTATES                                */
    api.jobstates.embed = "job";

    /*                                  FILES                                  */
    api.files.content = function(file) {
      return $http.get(urlize(this.url, file, "content"));
    };

    /*                                  SEARCH                                 */
    api.search.create = function(pattern) {
      return $http
        .post(this.url, { pattern: pattern })
        .then(_.property("data"));
    };

    /*                                  METRICS                                */
    api.metrics.topics = function() {
      var url = urlize(this.url, "topics/");
      return $http.get(url).then(_.property("data.topics"));
    };

    return api;
  }
]);
