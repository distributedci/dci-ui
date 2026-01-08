import type { IAnalyticsJob } from "types";
import { formatHardwareData, type INode } from "analytics/hardware/hardwareFormatter";
import type { IJobHardwareData } from "analytics/hardware/hardwareApi";
import { humanizeBytes } from "services/bytes";

export type HeatMapMatrix = {
  labelsY: HeatMapHardwareItem[];
  labelsX: HeatMapComponent[];
  matrix: number[][];
  maxValue: number;
};

export type HeatMapComponent = {
  id: string;
  display_name: string;
};

export type HeatMapHardwareItem = {
  id: string;
  display_name: string;
};

// Available hardware types from hardwareFormatter
export const HARDWARE_TYPES = [
  "product",
  "vendor",
  "motherboard",
  "bios",
  "cpu",
  "disk.vendor",
  "disk.product",
  "disk.device",
  "networkCard.vendor",
  "networkCard.product",
  "networkCard.interfaceName",
  "memory",
  "nbCore",
  "nbThread",
] as const;

export type HardwareType = (typeof HARDWARE_TYPES)[number];

// Extract hardware values from a node based on hardware type
// Returns an array because some types (disks, networkCards) can have multiple values
function getHardwareValues(
  node: INode,
  hardwareType: HardwareType,
): string[] {
  if (!node.hardware) return [];

  switch (hardwareType) {
    case "product":
      return node.hardware.product && node.hardware.product !== "N/A"
        ? [node.hardware.product]
        : [];
    case "vendor":
      return node.hardware.vendor && node.hardware.vendor !== "N/A"
        ? [node.hardware.vendor]
        : [];
    case "motherboard":
      return node.hardware.motherboard && node.hardware.motherboard !== "N/A"
        ? [node.hardware.motherboard]
        : [];
    case "bios":
      return node.hardware.bios && node.hardware.bios !== "N/A"
        ? [node.hardware.bios]
        : [];
    case "cpu":
      return node.hardware.cpu && node.hardware.cpu !== "N/A"
        ? [node.hardware.cpu]
        : [];
    case "disk.vendor":
      return node.hardware.disks
        .map((disk) => disk.vendor)
        .filter((v) => v && v !== "N/A");
    case "disk.product":
      return node.hardware.disks
        .map((disk) => disk.product)
        .filter((v) => v && v !== "N/A");
    case "disk.device":
      return node.hardware.disks
        .map((disk) => disk.device)
        .filter((v) => v && v !== "N/A");
    case "networkCard.vendor":
      return node.hardware.networkCards
        .map((card) => card.vendor)
        .filter((v) => v && v !== "N/A");
    case "networkCard.product":
      return node.hardware.networkCards
        .map((card) => card.product)
        .filter((v) => v && v !== "N/A");
    case "networkCard.interfaceName":
      return node.hardware.networkCards
        .map((card) => card.interfaceName)
        .filter((v) => v && v !== "N/A");
    case "memory":
      return node.hardware.memory > 0
        ? [humanizeBytes(node.hardware.memory)]
        : [];
    case "nbCore":
      return node.hardware.nbCore > 0
        ? [`${node.hardware.nbCore} cores`]
        : [];
    case "nbThread":
      return node.hardware.nbThread > 0
        ? [`${node.hardware.nbThread} threads`]
        : [];
    default:
      return [];
  }
}

// Extract hardware data from job's extra field
function extractHardwareFromJob(
  job: IAnalyticsJob & { extra?: IJobHardwareData },
): INode[] {
  if (!job.extra) return [];
  return formatHardwareData(job.extra);
}

export function createHardwareCoverageHeatMap(
  jobs: (IAnalyticsJob & { extra?: IJobHardwareData })[],
  hardwareType: HardwareType,
  targetComponentType: string,
): HeatMapMatrix {
  const hardwareMap = new Map<string, HeatMapHardwareItem>();
  const componentMap = new Map<string, HeatMapComponent>();

  // First pass: collect all unique hardware values and components
  for (const job of jobs) {
    const nodes = extractHardwareFromJob(job);
    
    // Collect hardware values
    for (const node of nodes) {
      const hardwareValues = getHardwareValues(node, hardwareType);
      for (const hardwareValue of hardwareValues) {
        if (!hardwareMap.has(hardwareValue)) {
          hardwareMap.set(hardwareValue, {
            id: hardwareValue,
            display_name: hardwareValue,
          });
        }
      }
    }

    // Collect components
    for (const component of job.components ?? []) {
      if (component.type === targetComponentType) {
        if (!componentMap.has(component.id)) {
          componentMap.set(component.id, {
            id: component.id,
            display_name: component.display_name,
          });
        }
      }
    }
  }

  const labelsY = Array.from(hardwareMap.values()).sort((a, b) =>
    a.display_name.localeCompare(b.display_name),
  );
  const labelsX = Array.from(componentMap.values()).sort((a, b) =>
    a.display_name.localeCompare(b.display_name),
  );

  const indexMapY = new Map<string, number>();
  const indexMapX = new Map<string, number>();
  labelsY.forEach((item, i) => indexMapY.set(item.id, i));
  labelsX.forEach((comp, i) => indexMapX.set(comp.id, i));

  const matrix = Array.from({ length: labelsY.length }, () =>
    Array(labelsX.length).fill(0),
  );

  let maxValue = 0;

  // Second pass: count co-occurrences
  for (const job of jobs) {
    const nodes = extractHardwareFromJob(job);
    const targetComponentIds =
      job.components
        ?.filter((c) => c.type === targetComponentType)
        .map((c) => c.id) ?? [];

    // Get unique hardware values for this job
    const hardwareValues = new Set<string>();
    for (const node of nodes) {
      const nodeHardwareValues = getHardwareValues(node, hardwareType);
      for (const hardwareValue of nodeHardwareValues) {
        hardwareValues.add(hardwareValue);
      }
    }

    // Count co-occurrences
    for (const hardwareValue of hardwareValues) {
      const row = indexMapY.get(hardwareValue);
      if (row === undefined) continue;

      for (const componentId of targetComponentIds) {
        const col = indexMapX.get(componentId);
        if (col === undefined) continue;

        matrix[row][col] += 1;
        if (matrix[row][col] > maxValue) {
          maxValue = matrix[row][col];
        }
      }
    }
  }

  return {
    labelsY,
    labelsX,
    matrix,
    maxValue,
  };
}

export function viridisFixedColor(value: number, maxValue: number): string {
  if (value === 0) return "transparent";

  const VIRIDIS_REVERSED: string[] = [
    "rgb(68, 1, 84)",
    "rgb(72, 27, 109)",
    "rgb(70, 50, 126)",
    "rgb(63, 71, 136)",
    "rgb(54, 92, 141)",
    "rgb(46, 110, 142)",
    "rgb(39, 127, 142)",
    "rgb(33, 145, 140)",
    "rgb(31, 161, 135)",
    "rgb(45, 178, 125)",
    "rgb(74, 193, 109)",
    "rgb(115, 208, 86)",
    "rgb(160, 218, 57)",
    "rgb(208, 225, 28)",
  ];

  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  const index = Math.floor(ratio * (VIRIDIS_REVERSED.length - 1));
  return VIRIDIS_REVERSED[index];
}
