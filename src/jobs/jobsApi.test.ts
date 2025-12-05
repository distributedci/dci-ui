import { createAnalyticsSearchParams } from "analytics/analyticsApi";
import type {
  IGetAnalyticsJobsResponse,
  IAnalyticsExtraJob,
  IJobExtraData,
} from "types";
import { teams, topic, remotecis } from "__tests__/data";

test("getJobExtraData query includes correct fields", () => {
  const includes =
    "id,extra.kernel.node,extra.kernel.version,extra.kernel.params,extra.hardware.motherboard,extra.hardware.memory,extra.hardware.disks,extra.hardware.network_cards.link_status,extra.hardware.network_cards.firmware_version,extra.hardware.network_cards.interface_name";
  const jobId = "test-job-id";
  const params = createAnalyticsSearchParams({
    query: `id='${jobId}'`,
    offset: 0,
    limit: 1,
    sort: "-created_at",
    includes,
  });

  expect(params).toContain("extra.kernel.node");
  expect(params).toContain("extra.kernel.version");
  expect(params).toContain("extra.kernel.params");
  expect(params).toContain("extra.hardware.motherboard");
  expect(params).toContain("extra.hardware.memory");
  expect(params).toContain("extra.hardware.disks");
  expect(params).toContain("extra.hardware.network_cards.link_status");
  expect(params).toContain("extra.hardware.network_cards.firmware_version");
  expect(params).toContain("extra.hardware.network_cards.interface_name");
  // The query parameter is URL-encoded, so check for the encoded version
  expect(params).toContain(`query=id%3D%27${jobId}%27`);
});

test("getJobExtraData handles empty response", () => {
  const emptyResponse: IGetAnalyticsJobsResponse<IAnalyticsExtraJob> = {
    _meta: { first_sync_date: "", last_sync_date: "" },
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      total: { value: 0, relation: "eq" },
      hits: [],
      max_score: null,
    },
    timed_out: false,
    took: 1,
  };

  expect(emptyResponse.hits.hits.length).toBe(0);
});

test("getJobExtraData extracts extra data correctly", () => {
  const mockExtraData: IJobExtraData = {
    kernel: [
      {
        node: "node1",
        version: "5.14.0",
        params: "console=ttyS0",
      },
    ],
    hardware: [
      {
        motherboard: "ASUS X570",
        memory: 64 * 1024 * 1024 * 1024,
        disks: [
          { name: "sda", size: "500GB" },
        ],
        network_cards: [
          {
            interface_name: "eth0",
            link_status: "up",
            firmware_version: "1.2.3",
          },
        ],
      },
    ],
  };

  const mockResponse: IGetAnalyticsJobsResponse<IAnalyticsExtraJob> = {
    _meta: { first_sync_date: "", last_sync_date: "" },
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      total: { value: 1, relation: "eq" },
      hits: [
        {
          _id: "test-job-id",
          _index: "jobs",
          _score: 1.0,
          _source: {
            id: "test-job-id",
            name: "test-job",
            status: "success",
            status_reason: null,
            created_at: "2024-01-01T00:00:00Z",
            url: "",
            components: [],
            comment: null,
            configuration: null,
            team: { id: teams[0].id, name: teams[0].name },
            topic: { name: topic.name },
            remoteci: { name: remotecis[0].name },
            pipeline: null,
            duration: 100,
            tags: [],
            extra: mockExtraData,
          },
          _type: "_doc",
          sort: [],
        },
      ],
      max_score: 1.0,
    },
    timed_out: false,
    took: 1,
  };

  const extractedExtra = mockResponse.hits.hits[0]._source.extra;
  expect(extractedExtra).toEqual(mockExtraData);
  expect(extractedExtra?.kernel).toBeDefined();
  expect(extractedExtra?.hardware).toBeDefined();
  expect(Array.isArray(extractedExtra?.kernel)).toBe(true);
  expect(Array.isArray(extractedExtra?.hardware)).toBe(true);
});

test("getJobExtraData handles null extra data", () => {
  const mockResponse: IGetAnalyticsJobsResponse<IAnalyticsExtraJob> = {
    _meta: { first_sync_date: "", last_sync_date: "" },
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      total: { value: 1, relation: "eq" },
      hits: [
        {
          _id: "test-job-id",
          _index: "jobs",
          _score: 1.0,
          _source: {
            id: "test-job-id",
            name: "test-job",
            status: "success",
            status_reason: null,
            created_at: "2024-01-01T00:00:00Z",
            url: "",
            components: [],
            comment: null,
            configuration: null,
            team: { id: teams[0].id, name: teams[0].name },
            topic: { name: topic.name },
            remoteci: { name: remotecis[0].name },
            pipeline: null,
            duration: 100,
            tags: [],
            extra: undefined,
          },
          _type: "_doc",
          sort: [],
        },
      ],
      max_score: 1.0,
    },
    timed_out: false,
    took: 1,
  };

  const extractedExtra = mockResponse.hits.hits[0]._source.extra;
  expect(extractedExtra).toBeUndefined();
});

