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

describe("admin remoteci edit component", function() {
  var component;

  beforeEach(
    inject(function($componentController) {
      component = $componentController("adminRemoteciEdit", null, {
        remoteci: remoteci
      });
    })
  );

  it("should init scope with remoteci prop", function() {
    expect(component.remoteci).toEqual(remoteci);
  });

  it("should update if data are valid", function() {
    component.remoteci = {
      id: "1",
      name: "rci",
      state: "active",
      allow_upgrade_job: true,
      data: {
        hardware: "Dell",
        network: "Juniper",
        storage: "swift",
        virtualization: "Xen"
      }
    };

    $httpBackend
      .expectPUT("https://api.example.org/api/v1/remotecis/1", {
        name: "rci",
        state: "active",
        allow_upgrade_job: true,
        data: {
          hardware: "Dell",
          network: "Juniper",
          storage: "swift",
          virtualization: "Xen"
        }
      })
      .respond();
    $httpBackend.whenGET("https://api.example.org/api/v1/remotecis").respond();
    component.update();
    $httpBackend.flush();
  });

  it("should not update if data are invalid", function() {
    component.remoteci = {
      id: "1",
      name: "rci",
      state: "active",
      data: "error"
    };
    component.update();
  });

  it("should refresh api secret", function() {
    expect(component.remoteci.api_secret).toBe(
      "736d3c54d96946954a2948db63266779"
    );
    $httpBackend
      .expectPUT(
        "https://api.example.org/api/v1/remotecis/c76c40a2-82c7-40e8-959b-0883d32edda8/api_secret",
        {}
      )
      .respond({
        api_secret: "9db63266779736d54a29483c54d96946",
        etag: "54d96946"
      });
    component.refreshApiSecretConfirmed();
    $httpBackend.flush();
    expect(component.remoteci.api_secret).toBe(
      "9db63266779736d54a29483c54d96946"
    );
    expect(component.remoteci.etag).toBe("54d96946");
    expect(component.remoteci.id).toBe("c76c40a2-82c7-40e8-959b-0883d32edda8");
  });
});
