import type { IHardware, INode } from "analytics/hardware/hardwareFormatter";

function _isIgnoredKernelParamValue(value: string): boolean {
  return value.toLowerCase().startsWith("uuid=");
}

function compareKernel(nodes: INode[]): string[] {
  const differences: string[] = [];
  const kernels = nodes.map((node) => node.kernel).filter((k) => k !== null);

  if (kernels.length < 2) return differences;

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
    .filter((h) => h !== null);

  if (hardwareList.length < 2) return differences;

  const products = new Set(hardwareList.map((h) => h.system_model));
  if (products.size > 1) {
    differences.push(`Product differs: ${Array.from(products).join(", ")}`);
  }

  const vendors = new Set(hardwareList.map((h) => h.system_vendor));
  if (vendors.size > 1) {
    differences.push(`Vendor differs: ${Array.from(vendors).join(", ")}`);
  }

  const motherboards = new Set(hardwareList.map((h) => h.system_family));
  if (motherboards.size > 1) {
    differences.push(
      `Motherboard differs: ${Array.from(motherboards).join(", ")}`,
    );
  }

  const biosList = new Set(hardwareList.map((h) => h.bios_version));
  if (biosList.size > 1) {
    differences.push(`BIOS differs: ${Array.from(biosList).join(", ")}`);
  }

  const cpus = new Set(hardwareList.map((h) => h.cpu_model));
  if (cpus.size > 1) {
    differences.push(`CPU differs: ${Array.from(cpus).join(", ")}`);
  }

  const memories = new Set(hardwareList.map((h) => h.memory_total_gb));
  if (memories.size > 1) {
    differences.push(
      `Memory differs: ${Array.from(memories)
        .map((gb) => `${gb} GB`)
        .join(", ")}`,
    );
  }

  return differences;
}

export function compareDisks(nodes: INode[]): string[] {
  const differences: string[] = [];
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h) => h !== null);

  if (hardwareList.length < 2) return differences;

  const disksByBusinfo = new Map<string, IHardware["storage_devices"]>();

  hardwareList.forEach((hardware) => {
    hardware.storage_devices.forEach((disk) => {
      const businfo = disk.businfo;
      if (!disksByBusinfo.has(businfo)) {
        disksByBusinfo.set(businfo, []);
      }
      disksByBusinfo.get(businfo)!.push(disk);
    });
  });

  disksByBusinfo.forEach((disks) => {
    if (disks.length < 2) return;

    const models = new Set(disks.map((d) => d.model));
    const vendors = new Set(disks.map((d) => d.vendor));
    const sizes = new Set(disks.map((d) => d.size_gb));

    if (models.size > 1 || vendors.size > 1 || sizes.size > 1) {
      const issues: string[] = [];
      if (models.size > 1) {
        issues.push(`product (${Array.from(models).join(", ")})`);
      }
      if (vendors.size > 1) {
        issues.push(`vendor (${Array.from(vendors).join(", ")})`);
      }
      if (sizes.size > 1) {
        issues.push(
          `size (${Array.from(sizes)
            .map((gb) => `${gb} GB`)
            .join(", ")})`,
        );
      }
      differences.push(
        `Disk device "/dev/sda" differs in: ${issues.join(", ")}`,
      );
    }
  });

  return differences;
}

export function compareNetworkCards(nodes: INode[]): string[] {
  const differences: string[] = [];
  const hardwareList = nodes
    .map((node) => node.hardware)
    .filter((h) => h !== null);

  if (hardwareList.length < 2) return differences;

  const networkCardCounts = hardwareList.map(
    (h) => h.network_interfaces.length,
  );
  const uniqueCounts = new Set(networkCardCounts);

  if (uniqueCounts.size > 1) {
    differences.push(
      `Number of network cards differs: ${Array.from(uniqueCounts).join(", ")} cards`,
    );
  }

  const cardsByInterface = new Map<string, IHardware["network_interfaces"]>();

  hardwareList.forEach((hardware) => {
    hardware.network_interfaces.forEach((card) => {
      const interfaceName = card.logical_name;
      if (!cardsByInterface.has(interfaceName)) {
        cardsByInterface.set(interfaceName, []);
      }
      cardsByInterface.get(interfaceName)!.push(card);
    });
  });

  cardsByInterface.forEach((cards, interfaceName) => {
    if (cards.length < 2) return;
    const issues: string[] = [];
    const linkStatuses = new Set(
      cards.map((c) => (c.link_status ? "up" : "down")),
    );
    if (linkStatuses.size > 1) {
      issues.push(`link status (${Array.from(linkStatuses).join(", ")})`);
    }
    const firmwareVersions = new Set(cards.map((c) => c.firmware_version));
    if (firmwareVersions.size > 1) {
      issues.push(
        `firmware version (${Array.from(firmwareVersions).join(", ")})`,
      );
    }
    const vendors = new Set(cards.map((c) => c.vendor));
    if (vendors.size > 1) {
      issues.push(`vendor (${Array.from(vendors).join(", ")})`);
    }
    const products = new Set(cards.map((c) => c.model));
    if (products.size > 1) {
      issues.push(`product (${Array.from(products).join(", ")})`);
    }
    if (issues.length > 0) {
      differences.push(
        `Network interface "${interfaceName}" differs in: ${issues.join(", ")}`,
      );
    }
  });

  return differences;
}

export type INodeDifferences = string[];

export function getHardwareDifferences(nodes: INode[]): INodeDifferences {
  if (nodes.length < 2) return [];
  return [
    ...compareKernel(nodes),
    ...compareBasicHardware(nodes),
    ...compareDisks(nodes),
    ...compareNetworkCards(nodes),
  ];
}
