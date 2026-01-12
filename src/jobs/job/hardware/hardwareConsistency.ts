import type {
  INode,
  INodeHardware,
  INodeKernel,
  IDisk,
  INetworkCard,
} from "analytics/hardware/hardwareFormatter";

export interface ConsistencyResult {
  isConsistent: boolean;
  differences: string[];
}

export interface RoleConsistency {
  directors: ConsistencyResult;
  workers: ConsistencyResult;
}

function parseKernelParams(params: string): Map<string, string> {
  const paramsMap = new Map<string, string>();
  if (!params || params.trim() === "") return paramsMap;

  // Split by spaces, but handle quoted values
  const parts = params.split(/\s+/).filter((p) => p.trim() !== "");

  for (const part of parts) {
    const equalIndex = part.indexOf("=");
    if (equalIndex === -1) continue;

    const key = part.substring(0, equalIndex);
    const value = part.substring(equalIndex + 1);

    // Ignore values that start with "UUID"
    if (value.startsWith("UUID")) continue;

    paramsMap.set(key, value);
  }

  return paramsMap;
}

function compareKernel(
  nodes: INode[],
  differences: string[],
): boolean {
  const kernels = nodes
    .map((node) => node.kernel)
    .filter((k): k is INodeKernel => k !== null);

  if (kernels.length === 0) return true;
  if (kernels.length === 1) return true;

  let allMatch = true;

  // Compare kernel versions
  const versions = new Set(kernels.map((k) => k.version));
  if (versions.size > 1) {
    differences.push(
      `Kernel versions differ: ${Array.from(versions).join(", ")}`,
    );
    allMatch = false;
  }

  // Parse and compare kernel params
  const paramsMaps = kernels.map((k) => parseKernelParams(k.params));
  const allKeys = new Set<string>();
  paramsMaps.forEach((map) => {
    map.forEach((_, key) => allKeys.add(key));
  });

  // Compare each key across all nodes
  for (const key of allKeys) {
    const values = new Set<string>();
    paramsMaps.forEach((map) => {
      const value = map.get(key);
      if (value !== undefined) {
        values.add(value);
      }
    });

    // Check if key exists in all nodes
    const keyExistsInAll = paramsMaps.every((map) => map.has(key));
    if (!keyExistsInAll) {
      differences.push(
        `Kernel parameter "${key}" is missing in some nodes`,
      );
      allMatch = false;
    } else if (values.size > 1) {
      differences.push(
        `Kernel parameter "${key}" differs: ${Array.from(values).join(", ")}`,
      );
      allMatch = false;
    }
  }

  return allMatch;
}

function compareBasicHardware(
  nodes: INode[],
  differences: string[],
): boolean {
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length === 0) return true;
  if (hardwareList.length === 1) return true;

  let allMatch = true;

  // Compare Product
  const products = new Set(hardwareList.map((h) => h.product));
  if (products.size > 1) {
    differences.push(
      `Product differs: ${Array.from(products).join(", ")}`,
    );
    allMatch = false;
  }

  // Compare Vendor
  const vendors = new Set(hardwareList.map((h) => h.vendor));
  if (vendors.size > 1) {
    differences.push(`Vendor differs: ${Array.from(vendors).join(", ")}`);
    allMatch = false;
  }

  // Compare Motherboard
  const motherboards = new Set(hardwareList.map((h) => h.motherboard));
  if (motherboards.size > 1) {
    differences.push(
      `Motherboard differs: ${Array.from(motherboards).join(", ")}`,
    );
    allMatch = false;
  }

  // Compare BIOS
  const biosList = new Set(hardwareList.map((h) => h.bios));
  if (biosList.size > 1) {
    differences.push(`BIOS differs: ${Array.from(biosList).join(", ")}`);
    allMatch = false;
  }

  // Compare CPU
  const cpus = new Set(hardwareList.map((h) => h.cpu));
  if (cpus.size > 1) {
    differences.push(`CPU differs: ${Array.from(cpus).join(", ")}`);
    allMatch = false;
  }

  // Compare Memory
  const memories = new Set(hardwareList.map((h) => h.memory));
  if (memories.size > 1) {
    differences.push(
      `Memory differs: ${Array.from(memories)
        .map((m) => `${(m / 1024 / 1024 / 1024).toFixed(2)} GB`)
        .join(", ")}`,
    );
    allMatch = false;
  }

  return allMatch;
}

function compareDisks(
  nodes: INode[],
  differences: string[],
): boolean {
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length === 0) return true;
  if (hardwareList.length === 1) return true;

  // Group disks by device name across all nodes
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

  let allMatch = true;

  // For each device name, check if all instances match
  disksByDevice.forEach((disks, deviceName) => {
    if (disks.length < 2) return; // Only one instance, nothing to compare

    const products = new Set(disks.map((d) => d.product));
    const vendors = new Set(disks.map((d) => d.vendor));
    const sizes = new Set(disks.map((d) => d.size));

    if (products.size > 1 || vendors.size > 1 || sizes.size > 1) {
      allMatch = false;
      const issues: string[] = [];
      if (products.size > 1) {
        issues.push(`product (${Array.from(products).join(", ")})`);
      }
      if (vendors.size > 1) {
        issues.push(`vendor (${Array.from(vendors).join(", ")})`);
      }
      if (sizes.size > 1) {
        issues.push(
          `size (${Array.from(sizes)
            .map((s) => `${(s / 1024 / 1024 / 1024).toFixed(2)} GB`)
            .join(", ")})`,
        );
      }
      differences.push(
        `Disk device "${deviceName}" differs in: ${issues.join(", ")}`,
      );
    }
  });

  return allMatch;
}

function compareNetworkCards(
  nodes: INode[],
  differences: string[],
): boolean {
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h): h is INodeHardware => h !== null);

  if (hardwareList.length === 0) return true;
  if (hardwareList.length === 1) return true;

  // Compare the number of network cards
  const networkCardCounts = hardwareList.map((h) => h.networkCards.length);
  const uniqueCounts = new Set(networkCardCounts);
  let allMatch = true;

  if (uniqueCounts.size > 1) {
    differences.push(
      `Number of network cards differs: ${Array.from(uniqueCounts).join(", ")} cards`,
    );
    allMatch = false;
  }

  // Group network cards by interface name across all nodes
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

  // For each interface name, check if all instances match
  cardsByInterface.forEach((cards, interfaceName) => {
    if (cards.length < 2) return; // Only one instance, nothing to compare

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
      allMatch = false;
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

  return allMatch;
}

function checkRoleConsistency(nodes: INode[]): ConsistencyResult {
  const differences: string[] = [];

  if (nodes.length <= 1) {
    return { isConsistent: true, differences: [] };
  }

  const kernelConsistent = compareKernel(nodes, differences);
  const basicConsistent = compareBasicHardware(nodes, differences);
  const disksConsistent = compareDisks(nodes, differences);
  const networkConsistent = compareNetworkCards(nodes, differences);

  const isConsistent =
    kernelConsistent &&
    basicConsistent &&
    disksConsistent &&
    networkConsistent;

  return { isConsistent, differences };
}

export function checkHardwareConsistency(nodes: INode[]): RoleConsistency {
  const directors = nodes.filter((node) => node.role === "director");
  const workers = nodes.filter((node) => node.role === "worker");

  return {
    directors: checkRoleConsistency(directors),
    workers: checkRoleConsistency(workers),
  };
}
