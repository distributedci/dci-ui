import { IJob } from "types";
import { groupJobsByPipeline } from "./pipelineJobs";

test("groupJobByPipeline of jobs with no jobs", () => {
  expect(groupJobsByPipeline([])).toEqual([]);
});

test("groupJobByPipeline with jobs", () => {
  const jobs = [
    {
      id: "j8",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:50.139451",
    },
    {
      id: "j7",
      previous_job_id: "j6",
      created_at: "2018-06-14T15:30:45.139451",
    },
    {
      id: "j6",
      previous_job_id: "j5",
      created_at: "2018-06-14T15:30:40.139451",
    },
    {
      id: "j5",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:35.139451",
    },
    {
      id: "j4",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:30.139451",
    },
    {
      id: "j3",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:25.139451",
    },
    {
      id: "j2",
      previous_job_id: "j1",
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs)).toEqual([
    {
      id: "j8",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:50.139451",
      index: 0,
      children: [],
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
      index: 7,
      children: [
        {
          id: "j2",
          previous_job_id: "j1",
          created_at: "2018-06-14T15:30:20.139451",
          index: 6,
          children: [],
        },
        {
          id: "j3",
          previous_job_id: "j1",
          created_at: "2018-06-14T15:30:25.139451",
          index: 5,
          children: [],
        },
        {
          id: "j4",
          previous_job_id: "j1",
          created_at: "2018-06-14T15:30:30.139451",
          index: 4,
          children: [],
        },
        {
          id: "j5",
          previous_job_id: "j1",
          created_at: "2018-06-14T15:30:35.139451",
          index: 3,
          children: [
            {
              id: "j6",
              previous_job_id: "j5",
              created_at: "2018-06-14T15:30:40.139451",
              index: 2,
              children: [
                {
                  id: "j7",
                  previous_job_id: "j6",
                  created_at: "2018-06-14T15:30:45.139451",
                  index: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
});

test("nrt groupJobByPipeline with jobs keep job order", () => {
  const jobs = [
    {
      id: "j3",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:25.139451",
    },
    {
      id: "j2",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs)).toEqual([
    {
      id: "j3",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:25.139451",
      children: [],
      index: 0,
    },
    {
      id: "j2",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:20.139451",
      children: [],
      index: 1,
    },
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
      children: [],
      index: 2,
    },
  ]);
});

test("nrt groupJobByPipeline with jobs keep job order newest last", () => {
  const jobs = [
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
    },
    {
      id: "j2",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:20.139451",
    },
    {
      id: "j3",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:25.139451",
    },
  ] as unknown as IJob[];
  expect(groupJobsByPipeline(jobs)).toEqual([
    {
      id: "j1",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:15.139451",
      children: [],
      index: 0,
    },
    {
      id: "j2",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:20.139451",
      children: [],
      index: 1,
    },
    {
      id: "j3",
      previous_job_id: null,
      created_at: "2018-06-14T15:30:25.139451",
      children: [],
      index: 2,
    },
  ]);
});
