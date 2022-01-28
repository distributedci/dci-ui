import {
  buildComponentMatrix,
  getComponentMatrixDomain,
} from "./componentMatrix";

test("buildComponentMatrix", () => {
  expect(
    buildComponentMatrix({
      total: {
        value: 8,
        relation: "eq",
      },
      max_score: null,
      hits: [
        {
          _id: "es1",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c1",
            component_name: "c1",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es2",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c1",
            component_name: "c1",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "3b8ea5e8-3756-4ce9-afd1-573fd2b57816",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c2",
            component_name: "c2",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es3",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c2",
            component_name: "c2",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es3",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c3",
            component_name: "c3",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es4",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c3",
            component_name: "c3",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:28.198117",
                id: "j1",
              },
              {
                created_at: "2022-01-14T01:54:26.817058",
                id: "j2",
              },
              {
                created_at: "2022-01-14T01:45:05.186011",
                id: "j3",
              },
              {
                created_at: "2022-01-14T02:01:09.214449",
                id: "j4",
              },
            ],
            tags: ["tag1", "tag2"],
            team_id: null,
            topic_id: "to1",
          },
          _type: "_doc",
        },
        {
          _id: "es5",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c4",
            component_name: "c4",
            failed_jobs: [],
            product_id: "p1",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:51.059561",
                id: "j5",
              },
              {
                created_at: "2022-01-14T01:54:41.266849",
                id: "j6",
              },
              {
                created_at: "2022-01-14T01:45:14.828134",
                id: "j7",
              },
              {
                created_at: "2022-01-14T02:01:30.675394",
                id: "j8",
              },
            ],
            tags: ["tag2"],
            team_id: null,
            topic_id: "to2",
          },
          _type: "_doc",
        },
        {
          _id: "es6",
          _index: "tasks_components_coverage",
          _score: 1.0,
          _source: {
            component_id: "c5",
            component_name: "c5",
            failed_jobs: [
              {
                created_at: "2022-01-14T01:45:14.828134",
                id: "j11",
              },
              {
                created_at: "2022-01-14T02:01:30.675394",
                id: "j12",
              },
            ],
            product_id: "p2",
            success_jobs: [
              {
                created_at: "2022-01-14T01:19:51.059561",
                id: "j9",
              },
              {
                created_at: "2022-01-14T01:54:41.266849",
                id: "j10",
              },
            ],
            tags: ["tag2"],
            team_id: null,
            topic_id: "to3",
          },
          _type: "_doc",
        },
      ],
    })
  ).toEqual({
    p1: {
      c1: { id: "c1", name: "c1", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
      c2: { id: "c2", name: "c2", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
      c3: { id: "c3", name: "c3", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
      c4: { id: "c4", name: "c4", nbOfSuccessfulJobs: 4, nbOfJobs: 4 },
    },
    p2: { c5: { id: "c5", name: "c5", nbOfSuccessfulJobs: 2, nbOfJobs: 4 } },
  });
});

test("getComponentMatrixDomain", () => {
  expect(
    getComponentMatrixDomain({
      p1: {
        c1: { id: "c1", name: "c1", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
        c2: { id: "c2", name: "c2", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
        c3: { id: "c3", name: "c3", nbOfSuccessfulJobs: 8, nbOfJobs: 8 },
        c4: { id: "c4", name: "c4", nbOfSuccessfulJobs: 4, nbOfJobs: 4 },
      },
      p2: { c5: { id: "c5", name: "c5", nbOfSuccessfulJobs: 2, nbOfJobs: 4 } },
    })
  ).toEqual({
    min: 0,
    max: 8,
  });
});
