import { describe, it, expect } from "vitest";
import {
  computeMetrics,
  aggregateJobsByRemoteci,
  aggregateJobsByProduct,
  aggregateJobsByTopic,
  extractProductFromTopic,
} from "./dashboardUtils";
import type { IAnalyticsJob } from "types";

const mockJob = (
  status: "success" | "failure" | "error" | "killed",
  remoteci: string,
  topic: string,
): IAnalyticsJob =>
  ({
    id: "1",
    name: "test job",
    status,
    status_reason: null,
    created_at: "2024-01-15T10:00:00Z",
    url: "http://example.com",
    components: [],
    comment: null,
    configuration: null,
    team: { id: "team1", name: "Test Team" },
    topic: { name: topic },
    remoteci: { name: remoteci },
    pipeline: { id: "p1", created_at: "2024-01-15T10:00:00Z", name: "Pipeline 1" },
    tags: [],
    duration: 100,
  }) as IAnalyticsJob;

describe("computeMetrics", () => {
  it("returns zero for empty array", () => {
    const result = computeMetrics([]);
    expect(result).toEqual({ total: 0, failed: 0, success: 0 });
  });

  it("computes metrics correctly", () => {
    const jobs = [
      mockJob("success", "remoteci1", "RHEL-8.6"),
      mockJob("failure", "remoteci1", "RHEL-8.6"),
      mockJob("error", "remoteci2", "OCP-4.12"),
      mockJob("killed", "remoteci2", "OCP-4.12"),
      mockJob("success", "remoteci1", "RHEL-9.0"),
    ];
    const result = computeMetrics(jobs);
    expect(result).toEqual({ total: 5, failed: 3, success: 2 });
  });
});

describe("extractProductFromTopic", () => {
  it("extracts product from topic name", () => {
    expect(extractProductFromTopic("RHEL-8.6")).toBe("RHEL");
    expect(extractProductFromTopic("OCP-4.12")).toBe("OCP");
    expect(extractProductFromTopic("RHEL-9.0.1")).toBe("RHEL");
    expect(extractProductFromTopic("Product")).toBe("Product");
  });

  it("returns Unknown for invalid topics", () => {
    expect(extractProductFromTopic("")).toBe("Unknown");
    expect(extractProductFromTopic("123")).toBe("Unknown");
  });
});

describe("aggregateJobsByRemoteci", () => {
  it("returns empty array for empty input", () => {
    expect(aggregateJobsByRemoteci([])).toEqual([]);
  });

  it("aggregates jobs by remoteci", () => {
    const jobs = [
      mockJob("success", "remoteci1", "RHEL-8.6"),
      mockJob("failure", "remoteci1", "RHEL-8.6"),
      mockJob("success", "remoteci2", "OCP-4.12"),
      mockJob("success", "remoteci1", "RHEL-9.0"),
    ];
    const result = aggregateJobsByRemoteci(jobs);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "remoteci1", success: 2, failure: 1 });
    expect(result[1]).toEqual({ name: "remoteci2", success: 1, failure: 0 });
  });

  it("sorts by total jobs descending", () => {
    const jobs = [
      mockJob("success", "remoteci1", "RHEL-8.6"),
      mockJob("success", "remoteci2", "OCP-4.12"),
      mockJob("failure", "remoteci2", "OCP-4.12"),
      mockJob("success", "remoteci2", "OCP-4.12"),
    ];
    const result = aggregateJobsByRemoteci(jobs);
    expect(result[0].name).toBe("remoteci2");
    expect(result[1].name).toBe("remoteci1");
  });
});

describe("aggregateJobsByProduct", () => {
  it("returns empty array for empty input", () => {
    expect(aggregateJobsByProduct([])).toEqual([]);
  });

  it("aggregates jobs by product", () => {
    const jobs = [
      mockJob("success", "remoteci1", "RHEL-8.6"),
      mockJob("failure", "remoteci1", "RHEL-9.0"),
      mockJob("success", "remoteci2", "OCP-4.12"),
      mockJob("success", "remoteci1", "RHEL-8.7"),
    ];
    const result = aggregateJobsByProduct(jobs);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "RHEL", total: 3 });
    expect(result[1]).toEqual({ name: "OCP", total: 1 });
  });
});

describe("aggregateJobsByTopic", () => {
  it("returns empty object for empty input", () => {
    expect(aggregateJobsByTopic([])).toEqual({});
  });

  it("aggregates jobs by topic with colors", () => {
    const jobs = [
      mockJob("success", "remoteci1", "RHEL-8.6"),
      mockJob("failure", "remoteci1", "RHEL-8.6"),
      mockJob("success", "remoteci2", "OCP-4.12"),
    ];
    const result = aggregateJobsByTopic(jobs);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["RHEL-8.6"].total).toBe(2);
    expect(result["OCP-4.12"].total).toBe(1);
    expect(result["RHEL-8.6"].color).toBeTruthy();
    expect(result["OCP-4.12"].color).toBeTruthy();
  });
});
