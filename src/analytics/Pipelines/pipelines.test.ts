import { DateTime } from "luxon";
import {
  extractPipelinesFromAnalyticsJobs,
  extractClusterTag,
} from "./pipelines";
import { analyticsTwoResultsJobs } from "analytics/analyticsTestData";

test("extractPipelinesFromAnalyticsJobs", () => {
  expect(extractPipelinesFromAnalyticsJobs(analyticsTwoResultsJobs)).toEqual([
    {
      date: "2024-12-04",
      datetime: DateTime.fromISO("2024-12-04"),
      pipelines: [
        {
          id: "p1",
          name: "pipeline",
          created_at: "2024-12-04T06:42:05.836974",
          jobs: [
            {
              id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
              datetime: DateTime.fromISO("2024-10-17T14:38:41.696112"),
              name: "job1",
              status: "success",
              status_reason: "",
              components: [
                {
                  display_name: "python3-kubernetes 11.0.0-6.el8",
                  id: "c1",
                  topic_id: "t1",
                  type: "rpm",
                },
                {
                  display_name: "OpenShift 4.14.48",
                  id: "c2",
                  topic_id: "t1",
                  type: "ocp",
                },
              ],
              comment: "",
              results: {
                errors: 0,
                failures: 1,
                success: 2,
                skips: 3,
                total: 6,
              },
              duration: 905,
              tags: ["tag1", "tag 2"],
            },
            {
              id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
              datetime: DateTime.fromISO("2024-12-04T16:32:24.840989"),
              name: "job2",
              status: "success",
              status_reason: "",
              components: [
                {
                  display_name: "python3-kubernetes 11.0.0-6.el8",
                  id: "c1",
                  topic_id: "t1",
                  type: "rpm",
                },
                {
                  display_name: "OpenShift 4.14.48",
                  id: "c2",
                  topic_id: "t1",
                  type: "ocp",
                },
              ],
              comment: "",
              results: {
                errors: 1,
                failures: 1,
                success: 1,
                skips: 3,
                total: 6,
              },
              duration: 905,
              tags: ["tag1", "tag 2"],
            },
          ],
        },
      ],
    },
  ]);
});

test("extractPipelinesFromAnalyticsJobs from 404 not found", () => {
  expect(extractPipelinesFromAnalyticsJobs([])).toEqual([]);
});

test("extractClusterTag", () => {
  expect(extractClusterTag([])).toBeNull();
  expect(extractClusterTag(["tag1", "tag2"])).toBeNull();
  expect(extractClusterTag(["cluster:server04"])).toBe("cluster:server04");
  expect(extractClusterTag(["tag1", "cluster:server04", "tag2"])).toBe(
    "cluster:server04",
  );
  expect(extractClusterTag(["cluster:server04", "cluster:server05"])).toBe(
    "cluster:server04",
  );
});
