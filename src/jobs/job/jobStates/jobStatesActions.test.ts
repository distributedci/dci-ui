import {
  addDurationAndPipelineStatus,
  getLongerTaskFirst,
} from "./jobStatesActions";
import type { IJobState, IEnhancedJobState } from "types";

test("addDurationAndPipelineStatus computes duration in seconds", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "success",
      files: [
        {
          created_at: "2018-07-30T04:38:10.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
        {
          created_at: "2018-07-30T04:38:32.000000",
          updated_at: "2018-07-30T04:38:32.000000",
        },
      ],
    } as IJobState,
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "success",
      pipelineStatus: "success",
      duration: 22,
      files: [
        {
          created_at: "2018-07-30T04:38:10.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
        {
          created_at: "2018-07-30T04:38:32.000000",
          updated_at: "2018-07-30T04:38:32.000000",
          duration: 2,
        },
      ],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus gets previous updated_at from previous file", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      status: "new",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    } as IJobState,
    {
      created_at: "2018-07-30T04:38:30.000000",
      status: "success",
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
      ],
    } as IJobState,
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      status: "success",
      pipelineStatus: "success",
      duration: 20,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
      ],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus orders jobStates and files per date", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      status: "success",
      files: [
        {
          created_at: "2018-07-30T04:40:30.000000",
          updated_at: "2018-07-30T04:40:30.000000",
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
        },
      ],
    } as IJobState,
    {
      created_at: "2018-07-30T04:38:08.000000",
      status: "new",
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
        },
      ],
    } as IJobState,
  ];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:08.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [
        {
          created_at: "2018-07-30T04:38:08.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:30.000000",
      status: "success",
      pipelineStatus: "success",
      duration: 140,
      files: [
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
        {
          created_at: "2018-07-30T04:40:30.000000",
          updated_at: "2018-07-30T04:40:30.000000",
          duration: 120,
        },
      ],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus with last status failure", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:39:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run", files: [] },
    { created_at: "2018-07-30T04:41:10.000000", status: "running", files: [] },
    { created_at: "2018-07-30T04:42:10.000000", status: "failure", files: [] },
  ] as unknown as IJobState[];

  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "danger",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "failure",
      pipelineStatus: "danger",
      duration: 0,
      files: [],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus with last status success", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:39:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run", files: [] },
    { created_at: "2018-07-30T04:41:10.000000", status: "running", files: [] },
    { created_at: "2018-07-30T04:42:10.000000", status: "success", files: [] },
  ] as unknown as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "success",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus with last status failure unordered", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:42:10.000000", status: "failure", files: [] },
    { created_at: "2018-07-30T04:41:10.000000", status: "running", files: [] },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run", files: [] },
    { created_at: "2018-07-30T04:39:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:38:10.000000", status: "new", files: [] },
  ] as unknown as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "danger",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "failure",
      pipelineStatus: "danger",
      duration: 0,
      files: [],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus with non final status", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:39:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:40:10.000000", status: "pre-run", files: [] },
    { created_at: "2018-07-30T04:41:10.000000", status: "running", files: [] },
  ] as unknown as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "running",
      pipelineStatus: "info",
      duration: 0,
      files: [],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("addDurationAndPipelineStatus with running state in the middle", () => {
  const jobStates = [
    { created_at: "2018-07-30T04:38:10.000000", status: "new", files: [] },
    { created_at: "2018-07-30T04:39:10.000000", status: "pre-run", files: [] },
    { created_at: "2018-07-30T04:40:10.000000", status: "running", files: [] },
    { created_at: "2018-07-30T04:41:10.000000", status: "post-run", files: [] },
    { created_at: "2018-07-30T04:42:10.000000", status: "success", files: [] },
  ] as unknown as IJobState[];
  const expectedJobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      status: "new",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:39:10.000000",
      status: "pre-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:40:10.000000",
      status: "running",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:41:10.000000",
      status: "post-run",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
    {
      created_at: "2018-07-30T04:42:10.000000",
      status: "success",
      pipelineStatus: "success",
      duration: 0,
      files: [],
    },
  ];
  expect(addDurationAndPipelineStatus(jobStates)).toEqual(expectedJobStates);
});

test("getLongerTaskFirst filter task by duration", () => {
  const jobStates = [
    {
      created_at: "2018-07-30T04:38:10.000000",
      duration: 20,
      files: [
        {
          created_at: "2018-07-30T04:38:10.000000",
          updated_at: "2018-07-30T04:38:10.000000",
          duration: 0,
        },
        {
          created_at: "2018-07-30T04:38:30.000000",
          updated_at: "2018-07-30T04:38:30.000000",
          duration: 20,
        },
      ],
    },
    {
      created_at: "2018-07-30T04:38:10.000000",
      duration: 2,
      files: [
        {
          created_at: "2018-07-30T04:38:32.000000",
          updated_at: "2018-07-30T04:38:32.000000",
          duration: 2,
        },
      ],
    },
  ] as IEnhancedJobState[];
  const expectedTasks = [
    {
      created_at: "2018-07-30T04:38:30.000000",
      updated_at: "2018-07-30T04:38:30.000000",
      duration: 20,
    },
    {
      created_at: "2018-07-30T04:38:32.000000",
      updated_at: "2018-07-30T04:38:32.000000",
      duration: 2,
    },
    {
      created_at: "2018-07-30T04:38:10.000000",
      updated_at: "2018-07-30T04:38:10.000000",
      duration: 0,
    },
  ];
  expect(getLongerTaskFirst(jobStates)).toEqual(expectedTasks);
});
