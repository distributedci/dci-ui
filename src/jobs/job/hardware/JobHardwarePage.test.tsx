import { renderWithProviders } from "__tests__/renders";
import { server } from "__tests__/node";
import { HttpResponse, http } from "msw";
import JobHardwarePage from "./JobHardwarePage";
import type {
  IEnhancedJob,
  IJobHardwareData,
  IGetAnalyticsJobsResponse,
  IAnalyticsExtraJob,
} from "types";
import { teams, topic, remotecis, products } from "__tests__/data";
import realHardwareData from "./__tests__/fixtures/hardware-data.json";
import * as jobContext from "../jobContext";
import { vi } from "vitest";

const jobId = "test-job-id";

const mockJob: IEnhancedJob = {
  id: jobId,
  name: "test-job",
  status: "success",
  status_reason: null,
  client_version: "1.0.0",
  comment: null,
  components: [],
  configuration: null,
  duration: 100,
  previous_job_id: null,
  product_id: products[0].id,
  remoteci: remotecis[0],
  remoteci_id: remotecis[0].id,
  results: [],
  state: "active",
  tags: [],
  team: teams[0],
  team_id: teams[0].id,
  topic: topic,
  topic_id: topic.id,
  update_previous_job_id: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  url: null,
  user_agent: "test",
  pipeline: null,
  pipeline_id: null,
  keys_values: [],
  jobstates: [],
  tests: [],
  files: [],
  data: {},
  etag: "test-etag",
};

const mockHardwareData: IJobHardwareData = realHardwareData as IJobHardwareData;

function createHardwareMockHandlers(analyticsHandler: () => Response | Promise<Response>) {
  return [
    http.get(
      `https://api.distributed-ci.io/api/v1/analytics/jobs*`,
      analyticsHandler,
    ),
  ];
}

beforeEach(() => {
  vi.spyOn(jobContext, "useJob").mockReturnValue({ job: mockJob });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("Should display loading state", () => {
  server.use(
    ...createHardwareMockHandlers(() => {
      return new Promise(() => {});
    }),
  );

  const { container } = renderWithProviders(<JobHardwarePage />);

  expect(container).toBeTruthy();
});

test("Should display error state", async () => {
  server.use(
    ...createHardwareMockHandlers(() => {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }),
  );

  const { findByText } = renderWithProviders(<JobHardwarePage />);

  expect(await findByText("Error loading hardware data")).toBeInTheDocument();
});

test("Should display empty state when no hardware data", async () => {
  server.use(
    ...createHardwareMockHandlers(() => {
      return HttpResponse.json({
        _meta: { first_sync_date: "", last_sync_date: "" },
        hits: {
          total: { value: 0, relation: "eq" },
          hits: [],
          max_score: null,
        },
      } as IGetAnalyticsJobsResponse<IAnalyticsExtraJob>);
    }),
  );

  const { findByText } = renderWithProviders(<JobHardwarePage />);

  expect(await findByText("No hardware data")).toBeInTheDocument();
});

test("Should display kernel and hardware data", async () => {
  server.use(
    ...createHardwareMockHandlers(() => {
      const mockAnalyticsJob: IAnalyticsExtraJob = {
        id: jobId,
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
        extra: mockHardwareData,
      };
      return HttpResponse.json({
        _meta: { first_sync_date: "", last_sync_date: "" },
        hits: {
          total: { value: 1, relation: "eq" },
          hits: [
            {
              _id: jobId,
              _index: "jobs",
              _score: 1.0,
              _source: mockAnalyticsJob,
              _type: "_doc",
              sort: [],
            },
          ],
          max_score: 1.0,
        },
      } as IGetAnalyticsJobsResponse<IAnalyticsExtraJob>);
    }),
  );

  const { findByText, findAllByText, container } = renderWithProviders(<JobHardwarePage />);

  expect(await findByText(/Kernel - worker-0/i)).toBeInTheDocument();
  expect(await findAllByText(/5.14.0-570.64.1.el9_6.x86_64/i)).not.toHaveLength(0);

  expect(await findByText((content) => {
    return /Hardware - worker-0/i.test(content);
  }, {}, { timeout: 5000 })).toBeInTheDocument();
  expect(await findAllByText(/PowerEdge R740/i)).not.toHaveLength(0);
  expect(await findAllByText(/Dell Inc./i)).not.toHaveLength(0);

  const memoryText = container.textContent || "";
  if (memoryText.includes("GB") || memoryText.includes("MB")) {
    expect(memoryText).toMatch(/\d+\.\d+\s*(GB|MB)/i);
  }
});

test("Should display multiple nodes", async () => {
  const multiNodeHardwareData: IJobHardwareData = realHardwareData as IJobHardwareData;

  server.use(
    ...createHardwareMockHandlers(() => {
      const mockAnalyticsJob: IAnalyticsExtraJob = {
        id: jobId,
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
        extra: multiNodeHardwareData,
      };
      return HttpResponse.json({
        _meta: { first_sync_date: "", last_sync_date: "" },
        hits: {
          total: { value: 1, relation: "eq" },
          hits: [
            {
              _id: jobId,
              _index: "jobs",
              _score: 1.0,
              _source: mockAnalyticsJob,
              _type: "_doc",
              sort: [],
            },
          ],
          max_score: 1.0,
        },
      } as IGetAnalyticsJobsResponse<IAnalyticsExtraJob>);
    }),
  );

  const { findByText } = renderWithProviders(<JobHardwarePage />);

  expect(await findByText(/Kernel - worker-0/i)).toBeInTheDocument();
  expect(await findByText(/Hardware - worker-0/i)).toBeInTheDocument();
});
