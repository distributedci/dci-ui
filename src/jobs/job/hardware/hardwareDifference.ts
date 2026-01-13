import type {
  INode,
  INodeHardware,
  IDisk,
  INetworkCard,
} from "analytics/hardware/hardwareFormatter";
import { humanizeBytes } from "services/bytes";

export interface ConsistencyResult {
  isConsistent: boolean;
  differences: string[];
}

export interface RoleConsistency {
  directors: ConsistencyResult;
  workers: ConsistencyResult;
}

function _isIgnoredKernelParamValue(value: string): boolean {
  return value.toLowerCase().startsWith("uuid=");
}

function compareKernel(nodes: INode[]): string[] {
  const kernels = nodes.map((node) => node.kernel).filter((k) => k !== null);
  if (kernels.length <= 1) return [];

  const differences: string[] = [];

  const versions = new Set(kernels.map((k) => k.version));
  if (versions.size > 1) {
    differences.push(
      `Kernel versions differ: ${Array.from(versions).join(", ")}`,
    );
  }

  const parameters = kernels.map((k) => k.params);

  const allKeys = new Set<string>();
  for (const parameter of parameters) {
    Object.keys(parameter).forEach((k) => allKeys.add(k));
  }

  for (const key of allKeys) {
    const values = new Set<string>();
    let presentCount = 0;

    for (const parameter of parameters) {
      if (key in parameter) {
        const value = parameter[key];
        if (!_isIgnoredKernelParamValue(value)) {
          presentCount++;
          values.add(value);
        }
      }
    }

    if (presentCount === 0) continue;

    if (presentCount !== parameters.length) {
      differences.push(`Kernel parameter "${key}" is missing in some nodes`);
    }

    if (values.size > 1) {
      differences.push(
        `Kernel parameter "${key}" has different values across nodes: ${[
          ...values,
        ]
          .map((v) => `"${v}"`)
          .join(", ")}`,
      );
    }
  }

  return differences;
}

export function compareBasicHardware(nodes: INode[]): string[] {
  const differences: string[] = [];
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length <= 1) return differences;

  const products = new Set(hardwareList.map((h) => h.product));
  if (products.size > 1) {
    differences.push(`Product differs: ${Array.from(products).join(", ")}`);
  }

  const vendors = new Set(hardwareList.map((h) => h.vendor));
  if (vendors.size > 1) {
    differences.push(`Vendor differs: ${Array.from(vendors).join(", ")}`);
  }

  const motherboards = new Set(hardwareList.map((h) => h.motherboard));
  if (motherboards.size > 1) {
    differences.push(
      `Motherboard differs: ${Array.from(motherboards).join(", ")}`,
    );
  }

  const biosList = new Set(hardwareList.map((h) => h.bios));
  if (biosList.size > 1) {
    differences.push(`BIOS differs: ${Array.from(biosList).join(", ")}`);
  }

  const cpus = new Set(hardwareList.map((h) => h.cpu));
  if (cpus.size > 1) {
    differences.push(`CPU differs: ${Array.from(cpus).join(", ")}`);
  }

  const memories = new Set(hardwareList.map((h) => h.memory));
  if (memories.size > 1) {
    differences.push(
      `Memory differs: ${Array.from(memories).map(humanizeBytes).join(", ")}`,
    );
  }

  return differences;
}

export function compareDisks(nodes: INode[]): string[] {
  const differences: string[] = [];
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length <= 1) return differences;

  const disksByDevice = new Map<string, IDisk[]>();

  hardwareList.forEach((hardware) => {
    hardware.disks.forEach((disk) => {
      const deviceName = disk.device;
      if (!disksByDevice.has(deviceName)) {
        disksByDevice.set(deviceName, []);
      }
      disksByDevice.get(deviceName)!.push(disk);
    });
  });

  disksByDevice.forEach((disks, deviceName) => {
    if (disks.length < 2) return;

    const products = new Set(disks.map((d) => d.product));
    const vendors = new Set(disks.map((d) => d.vendor));
    const sizes = new Set(disks.map((d) => d.size));

    if (products.size > 1 || vendors.size > 1 || sizes.size > 1) {
      const issues: string[] = [];
      if (products.size > 1) {
        issues.push(`product (${Array.from(products).join(", ")})`);
      }
      if (vendors.size > 1) {
        issues.push(`vendor (${Array.from(vendors).join(", ")})`);
      }
      if (sizes.size > 1) {
        issues.push(
          `size (${Array.from(sizes).map(humanizeBytes).join(", ")})`,
        );
      }
      differences.push(
        `Disk device "${deviceName}" differs in: ${issues.join(", ")}`,
      );
    }
  });

  return differences;
}

export function compareNetworkCards(nodes: INode[]): string[] {
  const differences: string[] = [];
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length <= 1) return differences;

  const networkCardCounts = hardwareList.map((h) => h.networkCards.length);
  const uniqueCounts = new Set(networkCardCounts);

  if (uniqueCounts.size > 1) {
    differences.push(
      `Number of network cards differs: ${Array.from(uniqueCounts).join(", ")} cards`,
    );
  }

  const cardsByInterface = new Map<string, INetworkCard[]>();

  hardwareList.forEach((hardware) => {
    hardware.networkCards.forEach((card) => {
      const interfaceName = card.interfaceName;
      if (!cardsByInterface.has(interfaceName)) {
        cardsByInterface.set(interfaceName, []);
      }
      cardsByInterface.get(interfaceName)!.push(card);
    });
  });

  cardsByInterface.forEach((cards, interfaceName) => {
    if (cards.length < 2) return;

    const linkStatuses = new Set(cards.map((c) => c.linkStatus));
    const firmwareVersions = new Set(cards.map((c) => c.firmwareVersion));
    const vendors = new Set(cards.map((c) => c.vendor));
    const products = new Set(cards.map((c) => c.product));

    if (
      linkStatuses.size > 1 ||
      firmwareVersions.size > 1 ||
      vendors.size > 1 ||
      products.size > 1
    ) {
      const issues: string[] = [];
      if (linkStatuses.size > 1) {
        issues.push(`link status (${Array.from(linkStatuses).join(", ")})`);
      }
      if (firmwareVersions.size > 1) {
        issues.push(
          `firmware version (${Array.from(firmwareVersions).join(", ")})`,
        );
      }
      if (vendors.size > 1) {
        issues.push(`vendor (${Array.from(vendors).join(", ")})`);
      }
      if (products.size > 1) {
        issues.push(`product (${Array.from(products).join(", ")})`);
      }
      differences.push(
        `Network interface "${interfaceName}" differs in: ${issues.join(", ")}`,
      );
    }
  });

  return differences;
}

export type INodeDifferences = string[];

export function getHardwareDifferences(nodes: INode[]): INodeDifferences {
  if (nodes.length <= 1) return [];
  return [
    ...compareKernel(nodes),
    ...compareBasicHardware(nodes),
    ...compareDisks(nodes),
    ...compareNetworkCards(nodes),
  ];
}
