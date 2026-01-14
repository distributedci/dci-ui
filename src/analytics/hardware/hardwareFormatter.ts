import type {
  IHardwareData,
  IJobHardwareData,
  IKernelData,
  IKernelDataParams,
} from "./hardwareApi";

function flattenObject(
  obj: IKernelDataParams,
  parentKey = "",
  out: Record<string, string> = {},
): Record<string, string> {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "string") {
      out[newKey] = value;
    } else {
      flattenObject(value, newKey, out);
    }
  }
  return out;
}

function _parseKernelNode(kernelData: IKernelData): INodeKernel {
  return {
    version: kernelData.version || "N/A",
    params: kernelData.params ? flattenObject(kernelData.params) : {},
  };
}

function findInTree(items: any[], predicate: (item: any) => boolean): any[] {
  const results: any[] = [];
  const traverse = (item: any) => {
    if (predicate(item)) {
      results.push(item);
    }
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach(traverse);
    }
  };
  items.forEach(traverse);
  return results;
}

function getNumberValueOrAmount(
  memory: number | { amount?: number } | undefined,
): number {
  if (typeof memory === "number") {
    return memory;
  }

  if (typeof memory === "object" && memory !== null) {
    return memory.amount ?? 0;
  }

  return 0;
}

function getNetworkProductName(product: string | null | undefined): string {
  if (!product) return "N/A";
  return product.replace(/\[[0-9A-Fa-f]{4}:([0-9A-Fa-f]{4})\]/g, "[$1]");
}

function _parseHardwareNode(hardware: IHardwareData): INode["hardware"] {
  if (!hardware.data) return null;
  const children = hardware.data.children || [];

  // memory
  const memoryItems = findInTree(
    children,
    (item: any) => item.id === "memory" && item.description === "System Memory",
  );
  let totalMemory = 0;
  memoryItems.forEach((mem: any) => {
    if (mem.size && mem.units === "bytes") {
      totalMemory += Number(mem.size);
    }
  });
  const memory =
    totalMemory > 0
      ? totalMemory
      : getNumberValueOrAmount(hardware.data.memory);

  // motherboard
  const motherboardItems = findInTree(
    children,
    (item: any) => item.description === "Motherboard",
  );
  const motherboardFromTree =
    motherboardItems.length > 0 ? motherboardItems[0] : null;
  const motherboardDirect = hardware.data.motherboard;
  const formatMotherboard = (): string => {
    if (motherboardDirect) {
      if (typeof motherboardDirect === "string") {
        return motherboardDirect;
      } else if (motherboardDirect.type) {
        return motherboardDirect.type;
      }
    }
    if (motherboardFromTree) {
      const parts: string[] = [];
      if (motherboardFromTree.vendor) parts.push(motherboardFromTree.vendor);
      if (motherboardFromTree.product) parts.push(motherboardFromTree.product);
      if (motherboardFromTree.version)
        parts.push(`v${motherboardFromTree.version}`);
      return parts.length > 0 ? parts.join(" ") : "N/A";
    }
    return "N/A";
  };

  // bios
  const biosItems = findInTree(
    children,
    (item: any) => item.id === "firmware" && item.description === "BIOS",
  );
  const bios = biosItems.length > 0 ? biosItems[0] : null;
  const formatBIOS = (): string => {
    if (!bios) return "N/A";
    const parts: string[] = [];
    if (bios.vendor) parts.push(bios.vendor);
    if (bios.version) parts.push(bios.version);
    if (bios.date) parts.push(`(${bios.date})`);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  //cpu
  const cpuItems = findInTree(
    children,
    (item: any) => item.id === "cpu" || item.class === "processor",
  );
  const formatCPU = (): string => {
    if (cpuItems.length === 0) return "N/A";

    const cpu = cpuItems[0];
    const parts: string[] = [];

    if (cpuItems.length > 1) {
      parts.push(`${cpuItems.length} x`);
    }

    if (cpu.vendor) parts.push(cpu.vendor);
    if (cpu.product) parts.push(cpu.product);

    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  // cpu frequency
  const getCPUFrequency = (): number => {
    if (cpuItems.length === 0) return 0;
    const cpu = cpuItems[0];
    if (cpu.size && cpu.units === "Hz") {
      return cpu.size;
    }
    if (cpu.capacity && cpu.units === "Hz") {
      return cpu.capacity;
    }
    return 0;
  };

  // cpu capacity
  const getCPUCapacity = (): number => {
    if (cpuItems.length === 0) return 0;
    const cpu = cpuItems[0];
    if (cpu.size && cpu.units === "Hz") {
      return cpu.size;
    }
    if (cpu.capacity && cpu.units === "Hz") {
      return cpu.capacity;
    }
    return 0;
  };

  // nb core
  const getNbCore = (): number => {
    if (cpuItems.length === 0) return 0;
    const cpu = cpuItems[0];
    if (!cpu.configuration) return 0;
    const config = cpu.configuration;
    const multiplier = cpuItems.length;
    if (config.cores) {
      return parseInt(config.cores) * multiplier;
    }
    return 0;
  };

  // nb thread
  const getNbThread = (): number => {
    if (cpuItems.length === 0) return 0;
    const cpu = cpuItems[0];
    if (!cpu.configuration) return 0;
    const config = cpu.configuration;
    const multiplier = cpuItems.length;
    if (config.threads) {
      return parseInt(config.threads) * multiplier;
    }
    return 0;
  };

  // disks
  const disks = findInTree(
    children,
    (item: any) =>
      item.class === "disk" ||
      (item.id && item.id.toString().startsWith("disk")),
  );
  const formattedDisks: IDisk[] = disks.map((disk: any) => {
    const deviceName = Array.isArray(disk.logicalname)
      ? disk.logicalname[0]
      : disk.logicalname || disk.dev || "N/A";
    const diskSize = getNumberValueOrAmount(disk.size);
    return {
      device: deviceName,
      product: disk.product || "N/A",
      vendor: disk.vendor || "N/A",
      size: diskSize,
    };
  });

  // network cards
  const networkCards = findInTree(
    children,
    (item: any) => item.class === "network",
  );
  const formattedNetworkCards: INetworkCard[] = networkCards.map(
    (card: any) => {
      const link = card.configuration?.link;
      const linkStatus =
        link === true || link === "yes"
          ? "up"
          : link === false || link === "no"
            ? "down"
            : typeof link === "string"
              ? link
              : "unknown";

      const product = getNetworkProductName(card.product);

      const interfaceName = Array.isArray(card.logicalname)
        ? card.logicalname[0]
        : card.logicalname || card.id || "N/A";

      const speed =
        card.configuration?.speed ||
        (card.size ? `${(card.size / 1000000000).toFixed(0)}Gbit/s` : "-");

      return {
        vendor: card.vendor || "N/A",
        product,
        interfaceName,
        linkStatus,
        speed,
        firmwareVersion: card.configuration?.firmware || card.version || "N/A",
      } satisfies INetworkCard;
    },
  );

  return {
    product: hardware.data.product || "N/A",
    vendor: hardware.data.vendor || "N/A",
    motherboard: formatMotherboard(),
    bios: formatBIOS(),
    cpu: formatCPU(),
    nbCore: getNbCore(),
    nbThread: getNbThread(),
    cpuFrequency: getCPUFrequency(),
    cpuCapacity: getCPUCapacity(),
    memory,
    disks: formattedDisks,
    networkCards: formattedNetworkCards,
  };
}

type NodeRole = "director" | "worker" | "unknown";
export interface IDisk {
  device: string;
  product: string;
  vendor: string;
  size: number;
}
export interface INetworkCard {
  vendor: string;
  product: string;
  interfaceName: string;
  linkStatus: string;
  speed: string;
  firmwareVersion: string;
}

export interface INodeKernel {
  version: string;
  params: Record<string, string>;
}
export interface INodeHardware {
  product: string;
  vendor: string;
  motherboard: string;
  bios: string;
  cpu: string;
  nbCore: number;
  nbThread: number;
  cpuFrequency: number;
  cpuCapacity: number;
  memory: number;
  disks: IDisk[];
  networkCards: INetworkCard[];
}
export interface INode {
  name: string;
  kernel: INodeKernel | null;
  hardware: INodeHardware | null;
  role: NodeRole;
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function getNodeRole(nodeName: string): NodeRole {
  const name = nodeName.toLowerCase();

  if (name.includes("master") || name.includes("director")) {
    return "director";
  }

  if (name.includes("slave") || name.includes("worker")) {
    return "worker";
  }

  return "unknown";
}

export function formatHardwareData(
  hardware: IJobHardwareData | null | undefined,
): INode[] {
  if (!hardware) return [];
  const nodes: Record<string, INode> = {};
  const hardwareNodes = asArray(hardware);
  for (const node of hardwareNodes) {
    const nodeName =
      "kernel" in node && node.kernel.node
        ? node.kernel.node
        : "hardware" in node
          ? node.hardware.node || "Unknown Node"
          : "Unknown Node";

    const currentNode = (nodes[nodeName] ??= {
      name: nodeName,
      kernel: null,
      hardware: null,
      role: getNodeRole(nodeName),
    });

    if ("kernel" in node && node.kernel.node) {
      currentNode.kernel = _parseKernelNode(node.kernel);
    }
    if ("hardware" in node && node.hardware.node) {
      currentNode.hardware = _parseHardwareNode(node.hardware);
    }
  }
  return Object.values(nodes);
}
