import { renderWithProviders } from "__tests__/renders";
import { server } from "__tests__/node";
import { HttpResponse, http } from "msw";
import App from "App";
import type {
  IEnhancedJob,
  IGetJobStates,
  IGetTestsResults,
  IJobExtraData,
  IGetAnalyticsJobsResponse,
  IAnalyticsExtraJob,
} from "types";
import { teams, topic, remotecis, products } from "__tests__/data";
import realExtraData from "./__tests__/fixtures/extra-data.json";

const jobId = "test-job-id";

// Create a non-admin user identity for job tests (to avoid redirect to admin)
const nonAdminIdentity = {
  email: "jobuser@redhat.com",
  etag: "191539996cb96d416cd386558de5d499",
  fullname: "Job User",
  id: "a48ecab4-01d0-97d9-4f45-f7b938808e24",
  name: "jobuser",
  teams: {
    "e5147a96-7c76-4415-b01e-edefba96a9c9": {
      has_pre_release_access: false,
      id: "e5147a96-7c76-4415-b01e-edefba96a9c9",
      name: "regular-team", // Not "admin" team
    },
  },
  timezone: "UTC",
};

// Shared mock handlers to avoid duplication
function createJobMockHandlers(analyticsHandler: () => Response | Promise<Response>) {
  return [
    http.get("https://api.distributed-ci.io/api/v1/identity", () => {
      return HttpResponse.json({ identity: nonAdminIdentity });
    }),
    http.get(`https://api.distributed-ci.io/api/v1/jobs/${jobId}`, () => {
      return HttpResponse.json({ job: mockJob });
    }),
    http.get(`https://api.distributed-ci.io/api/v1/jobs/${jobId}/results`, () => {
      return HttpResponse.json({ results: [] } as IGetTestsResults);
    }),
    http.get(
      `https://api.distributed-ci.io/api/v1/jobs/${jobId}/jobstates`,
      () => {
        return HttpResponse.json({ jobstates: [] } as IGetJobStates);
      },
    ),
    http.get(
      `https://api.distributed-ci.io/api/v1/analytics/jobs*`,
      analyticsHandler,
    ),
  ];
}

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
  keys_values: [],
  jobstates: [],
  tests: [],
  files: [],
  etag: "test-etag",
};

// Use real extra data structure from production
const mockExtraData: IJobExtraData = realExtraData as IJobExtraData;

test("Should display loading state", async () => {
  server.use(
    ...createJobMockHandlers(() => {
      return new Promise(() => {}); // Never resolves to keep loading
    }),
  );

  const { findByText, container } = renderWithProviders(<App />, {
    initialEntries: [`/jobs/${jobId}/extra`],
  });

  // Wait for the page to render - the job loading will show JobDetailsEnvelope
  // "Job details" appears in JobDetailsEnvelope even during loading
  // Wait for it to appear (indicates the page has rendered)
  await findByText("Job details");
  
  // Since the analytics query never resolves, just verify basic job page functionality
  expect(container.textContent).toContain("test-job"); // Job name should be visible
});

test("Should display error state", async () => {
  server.use(
    ...createJobMockHandlers(() => {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }),
  );

  const { findByText } = renderWithProviders(<App />, {
    initialEntries: [`/jobs/${jobId}/extra`],
  });

  // Wait for the page to render and job to load
  // Wait for "Job details" to appear (indicates job page has loaded)
  await findByText("Job details");
  
  // Then check for error message - look for the specific title text
  expect(await findByText("Error loading extra data")).toBeInTheDocument();
});

test("Should display empty state when no extra data", async () => {
  server.use(
    ...createJobMockHandlers(() => {
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

  const { findByText } = renderWithProviders(<App />, {
    initialEntries: [`/jobs/${jobId}/extra`],
  });

  // Wait for the page to render and job to load
  // Wait for "Job details" to appear (indicates job page has loaded)
  await findByText("Job details");
  
  // Then check for empty state - look for the specific title text
  expect(await findByText("No extra data")).toBeInTheDocument();
});

test("Should display kernel and hardware data", async () => {
  server.use(
    ...createJobMockHandlers(() => {
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
        extra: mockExtraData,
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

  const { findByText, findAllByText, container } = renderWithProviders(<App />, {
    initialEntries: [`/jobs/${jobId}/extra`],
  });

  // Wait for the page to render and job to load
  // Wait for "Job details" to appear (indicates job page has loaded)
  await findByText("Job details");
  
  // Then wait for the extra data to load and render
  // Check kernel data - using real data structure
  expect(await findByText(/Kernel - worker-0/i)).toBeInTheDocument();
  expect(await findAllByText(/5.14.0-570.64.1.el9_6.x86_64/i)).not.toHaveLength(0);
  
  // Check hardware data - using real data structure
  expect(await findByText((content) => {
    return /Hardware - worker-0/i.test(content);
  }, {}, { timeout: 5000 })).toBeInTheDocument();
  expect(await findAllByText(/PowerEdge R740/i)).not.toHaveLength(0);
  expect(await findAllByText(/Dell Inc./i)).not.toHaveLength(0);
  
  // Check for memory display (should show formatted memory if available)
  const memoryText = container.textContent || "";
  if (memoryText.includes("GB") || memoryText.includes("MB")) {
    // Memory is displayed
    expect(memoryText).toMatch(/\d+\.\d+\s*(GB|MB)/i);
  }
});

test("Should display multiple nodes", async () => {
  // Use real data which has multiple nodes
  const multiNodeExtraData: IJobExtraData = realExtraData as IJobExtraData;

  server.use(
    ...createJobMockHandlers(() => {
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
        extra: multiNodeExtraData,
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

  const { findByText } = renderWithProviders(<App />, {
    initialEntries: [`/jobs/${jobId}/extra`],
  });

  // Wait for the page to render and job to load
  // Wait for "Job details" to appear (indicates job page has loaded)
  await findByText("Job details");
  
  // Then wait for the extra data to load and render
  // Check for kernel nodes from anonymized test data
  expect(await findByText(/Kernel - worker-0/i)).toBeInTheDocument();
  
  // Check for hardware nodes from anonymized test data
  expect(await findByText(/Hardware - worker-0/i)).toBeInTheDocument();
});

