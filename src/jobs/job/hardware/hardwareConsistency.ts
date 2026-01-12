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

export function parseKernelParams(params: string): Map<string, string> {
  const paramsMap = new Map<string, string>();
  if (!params || params.trim() === "") return paramsMap;

  const parts = params.split(/\s+/).filter((p) => p.trim() !== "");

  for (const part of parts) {
    const equalIndex = part.indexOf("=");
    if (equalIndex === -1) continue;

    const key = part.substring(0, equalIndex);
    const value = part.substring(equalIndex + 1);

    if (value.startsWith("UUID")) continue;

    paramsMap.set(key, value);
  }

  return paramsMap;
}

export function compareKernel(nodes: INode[]): string[] {
  const differences: string[] = [];
  const kernels = nodes
    .map((node) => node.kernel)
    .filter((k): k is INodeKernel => k !== null);

  if (kernels.length <= 1) return differences;

  const versions = new Set(kernels.map((k) => k.version));
  if (versions.size > 1) {
    differences.push(
      `Kernel versions differ: ${Array.from(versions).join(", ")}`,
    );
  }

  const paramsMaps = kernels.map((k) => parseKernelParams(k.params));
  const allKeys = new Set<string>();
  paramsMaps.forEach((map) => {
    map.forEach((_, key) => allKeys.add(key));
  });

  for (const key of allKeys) {
    const values = new Set<string>();
    paramsMaps.forEach((map) => {
      const value = map.get(key);
      if (value !== undefined) {
        values.add(value);
      }
    });

    const keyExistsInAll = paramsMaps.every((map) => map.has(key));
    if (!keyExistsInAll) {
      differences.push(`Kernel parameter "${key}" is missing in some nodes`);
    } else if (values.size > 1) {
      differences.push(
        `Kernel parameter "${key}" differs: ${Array.from(values).join(", ")}`,
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
      `Memory differs: ${Array.from(memories)
        .map((m) => `${(m / 1024 / 1024 / 1024).toFixed(2)} GB`)
        .join(", ")}`,
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

function checkRoleConsistency(nodes: INode[]): ConsistencyResult {
  if (nodes.length <= 1) {
    return { isConsistent: true, differences: [] };
  }

  const differences = [
    ...compareKernel(nodes),
    ...compareBasicHardware(nodes),
    ...compareDisks(nodes),
    ...compareNetworkCards(nodes),
  ];

  return { isConsistent: differences.length === 0, differences };
}

export function checkHardwareConsistency(nodes: INode[]): RoleConsistency {
  const directors = nodes.filter((node) => node.role === "director");
  const workers = nodes.filter((node) => node.role === "worker");

  return {
    directors: checkRoleConsistency(directors),
    workers: checkRoleConsistency(workers),
  };
}
