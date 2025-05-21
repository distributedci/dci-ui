import { getJobStats, IGroupByKey, ISliceByKey } from "./jobStats";
import {
  analyticsEmptyData,
  analyticsOneJob,
  analyticsTwoJobs,
} from "analytics/analyticsTestData";

describe("getJobStats with sliceByKey 'tags'", () => {
  const groupByKey: IGroupByKey = "topic";
  const sliceByKey: ISliceByKey = "tags";

  test("returns empty object when no data", () => {
    expect(getJobStats(analyticsEmptyData, groupByKey, sliceByKey)).toEqual({});
  });

  test("splits tags into individual slices for a single job", () => {
    const stats = getJobStats(analyticsOneJob, groupByKey, sliceByKey);
    expect(stats).toEqual({
      [analyticsOneJob[0].topic.name]: {
        tag1: {
          color: "#1f77b4",
          total: 1,
          label: "tag1",
        },
        "tag 2": {
          color: "#ff7f0e",
          total: 1,
          label: "tag 2",
        },
      },
    });
  });

  test("aggregates tag counts across multiple jobs in the same group", () => {
    const stats = getJobStats(analyticsTwoJobs, "remoteci", sliceByKey);
    expect(stats).toEqual({
      [analyticsTwoJobs[0].remoteci.name]: {
        tag1: {
          color: "#1f77b4",
          total: 2,
          label: "tag1",
        },
        "tag 2": {
          color: "#ff7f0e",
          total: 2,
          label: "tag 2",
        },
      },
    });
  });
});