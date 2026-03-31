import nodesData from "analytics/hardware/__tests__/fixtures/nodes.json";
import type { ESNode } from "analytics/hardware/hardwareFormatter";
import {
  createHardwareCoverageHeatMap,
  viridisFixedColor,
} from "./heatMap";

const nodes = nodesData as ESNode[];

function makeJobWithNodes(
  overrides: {
    id?: string;
    components?: { id: string; display_name: string; type: string; topic_id: string }[];
    nodes?: ESNode[];
  } = {},
) {
  return {
    id: "job1",
    name: "test-job",
    status: "success" as const,
    status_reason: null,
    created_at: "2024-01-01",
    url: "",
    comment: null,
    configuration: null,
    duration: 100,
    tags: [],
    team: { id: "t1", name: "Team 1" },
    topic: { name: "Topic 1" },
    remoteci: { name: "Remoteci 1" },
    pipeline: { id: "p1", created_at: "", name: "pipeline" },
    components: [
      { id: "ocp-1", display_name: "OpenShift 4.18", topic_id: "t1", type: "ocp" },
      { id: "rpm-1", display_name: "python3-kubernetes", topic_id: "t1", type: "rpm" },
    ],
    nodes: nodes,
    ...overrides,
  };
}

test("createHardwareCoverageHeatMap returns empty matrix when no jobs have nodes", () => {
  const jobs = [
    makeJobWithNodes({ nodes: undefined }),
    makeJobWithNodes({ nodes: [] }),
  ];
  const result = createHardwareCoverageHeatMap(jobs, "cpu", "ocp");
  expect(result.labelsY).toEqual([]);
  expect(result.labelsX).toEqual([]);
  expect(result.matrix).toEqual([]);
  expect(result.maxValue).toBe(0);
});

test("createHardwareCoverageHeatMap extracts hardware and component coverage", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "cpu", "ocp");
  expect(result.labelsY.length).toBeGreaterThan(0);
  expect(result.labelsY.some((l) => l.display_name.includes("Xeon"))).toBe(true);
  expect(result.labelsX).toEqual([
    { id: "ocp-1", display_name: "OpenShift 4.18" },
  ]);
  expect(result.maxValue).toBeGreaterThanOrEqual(1);
});

test("createHardwareCoverageHeatMap with vendor hardware type", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "vendor", "ocp");
  expect(result.labelsY.length).toBeGreaterThan(0);
  expect(result.labelsY.some((l) => l.display_name === "vendor1")).toBe(true);
});

test("createHardwareCoverageHeatMap with disk.product (storage_devices.model)", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "disk.product", "ocp");
  expect(result.labelsY.some((l) => l.display_name.includes("LOGICAL VOLUME"))).toBe(true);
});

test("createHardwareCoverageHeatMap with networkCard.interfaceName", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "networkCard.interfaceName", "ocp");
  expect(result.labelsY.some((l) => l.display_name === "eno1")).toBe(true);
});

test("createHardwareCoverageHeatMap with nbCore (cpu_total_cores)", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "nbCore", "ocp");
  expect(result.labelsY.some((l) => l.display_name === "40 cores")).toBe(true);
});

test("createHardwareCoverageHeatMap with memory (memory_total_gb)", () => {
  const job = makeJobWithNodes();
  const result = createHardwareCoverageHeatMap([job], "memory", "ocp");
  expect(result.labelsY.length).toBeGreaterThan(0);
  expect(result.labelsY.some((l) => l.display_name.includes("GB"))).toBe(true);
});

test("createHardwareCoverageHeatMap counts co-occurrences across multiple jobs", () => {
  const job1 = makeJobWithNodes({ id: "job1" });
  const job2 = makeJobWithNodes({ id: "job2" });
  const result = createHardwareCoverageHeatMap([job1, job2], "cpu", "ocp");
  expect(result.maxValue).toBe(2);
});

test("viridisFixedColor returns transparent for zero", () => {
  expect(viridisFixedColor(0, 10)).toBe("transparent");
});

test("viridisFixedColor returns color for valid value", () => {
  const color = viridisFixedColor(5, 10);
  expect(color).toMatch(/^rgb\(/);
  expect(color).not.toBe("transparent");
});
