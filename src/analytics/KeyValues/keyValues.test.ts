import { extractKeys, extractKeysValues } from "./keyValues";
import {
  analyticsOneKeysValuesJob,
  analyticsTwoKeysValuesJobs,
} from "../analyticsTestData";
import type { IKeyValueGraph } from "./keyValuesTypes";

test("extractKeys with empty data", () => {
  expect(extractKeys([])).toEqual([]);
});

test("extractKeys with one analytic job", () => {
  expect(extractKeys(analyticsOneKeysValuesJob)).toEqual([
    "workarounds",
    "reboots",
  ]);
});

test("extractKeys with two analytic jobs", () => {
  expect(extractKeys(analyticsTwoKeysValuesJobs)).toEqual([
    "workarounds",
    "reboots",
  ]);
});

test("extractKeysValues with empty data", () => {
  const graph: IKeyValueGraph = {
    keys: [
      {
        key: "workarounds",
        color: "#4394e5",
        axis: "left",
      },
    ],
    graphType: "bar",
    group_by: "",
    name: "Graph",
  };
  expect(extractKeysValues(graph, [])).toEqual({
    yAxis: [],
    keys: [],
    data: [],
  });
});

test("extractKeysValues with one analytic job no group_by", () => {
  const graph: IKeyValueGraph = {
    keys: [
      {
        key: "workarounds",
        color: "#4394e5",
        axis: "left",
      },
    ],
    graphType: "line",
    group_by: "",
    name: "Graph",
  };
  expect(extractKeysValues(graph, analyticsOneKeysValuesJob)).toEqual({
    yAxis: [
      {
        orientation: "left",
        label: "workarounds",
        color: "#4394e5",
      },
    ],
    keys: [
      {
        label: "workarounds",
        key: "workarounds",
        color: "#4394e5",
        graphType: "line",
        axis: "left",
      },
    ],
    data: [
      {
        created_at: 1729175921696,
        id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
        name: "job1",
        keysValues: { workarounds: 1.0 },
      },
    ],
  });
});

test("extractKeysValues with two analytic jobs and grouped by topic", () => {
  const graph: IKeyValueGraph = {
    keys: [
      {
        key: "workarounds",
        color: "#4394e5",
        axis: "left",
      },
    ],
    graphType: "line",
    group_by: "topic",
    name: "Graph",
  };
  expect(extractKeysValues(graph, analyticsTwoKeysValuesJobs)).toEqual({
    yAxis: [
      {
        orientation: "left",
        label: "workarounds",
        color: "#4394e5",
      },
    ],
    keys: [
      {
        label: "workarounds - Topic 1",
        key: "workarounds_topic_1",
        color: "#707070",
        graphType: "line",
        axis: "left",
      },
      {
        label: "workarounds - Topic 2",
        key: "workarounds_topic_2",
        color: "#4394e5",
        graphType: "line",
        axis: "left",
      },
    ],
    data: [
      {
        created_at: 1729175921696,
        id: "50d93471-99e4-496b-8c6b-9c2e37fc61c3",
        name: "job1",
        keysValues: { workarounds_topic_1: 1.0 },
      },
      {
        created_at: 1733329944840,
        id: "347150d9-99e4-496b-8c6b-9c2e37fc61c3",
        name: "job2",
        keysValues: { workarounds_topic_2: 2.0 },
      },
    ],
  });
});
