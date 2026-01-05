import type { IHardwareData, IKernelData } from "types";

export interface FormattedHardwareData {
  nodeName: string;
  error?: string;
  product: string;
  vendor: string;
  motherboard: string;
  bios: string;
  cpu: string;
  cpuCoresThreads: string;
  cpuFrequency: string;
  memory: string;
  disks: FormattedDisk[];
  networkCards: FormattedNetworkCard[];
}

export interface FormattedDisk {
  device: string;
  product: string;
  vendor: string;
  size: string;
}

export interface FormattedNetworkCard {
  vendor: string;
  product: string;
  interfaceName: string;
  linkStatus: string;
  linkColor: { color?: string };
  speed: string;
  firmwareVersion: string;
}

export interface FormattedKernelData {
  nodeName: string;
  node: string;
  version: string;
  params: string;
}

export function formatMemory(memory: number | { amount?: number } | undefined): string {
  if (!memory) return "N/A";
  const amount = typeof memory === "number" ? memory : memory.amount || 0;
  if (amount === 0) return "N/A";
  if (amount >= 1024 * 1024 * 1024 * 1024) {
    return `${(amount / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
  } else if (amount >= 1024 * 1024 * 1024) {
    return `${(amount / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else if (amount >= 1024 * 1024) {
    return `${(amount / (1024 * 1024)).toFixed(2)} MB`;
  } else if (amount >= 1024) {
    return `${(amount / 1024).toFixed(2)} KB`;
  }
  return `${amount} B`;
}

function formatKernelParamValue(value: any, prefix: string = ""): string[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [`${prefix}=${value}`];
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return [`${prefix}=`];
    }

    const results: string[] = [];
    for (const [key, val] of entries) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      results.push(...formatKernelParamValue(val, newPrefix));
    }
    return results;
  }

  return [`${prefix}=${JSON.stringify(value)}`];
}

export function formatKernelParams(params: string | Record<string, any> | undefined): string {
  if (!params) return "N/A";

  if (typeof params === "string") {
    return params;
  }

  const formattedParams: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    formattedParams.push(...formatKernelParamValue(value, key));
  }

  return formattedParams.join(" ");
}

export function formatKernelData(kernel: IKernelData): FormattedKernelData {
  return {
    nodeName: kernel.node || "Unknown Node",
    node: kernel.node || "N/A",
    version: kernel.version || "N/A",
    params: formatKernelParams(kernel.params),
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

export function formatProductName(product: string | undefined): string {
  if (!product) return "N/A";
  return product.replace(/\[[0-9A-Fa-f]{4}:([0-9A-Fa-f]{4})\]/g, "[$1]");
}

export function formatHardwareData(hardware: IHardwareData): FormattedHardwareData {
  const hardwareData = (hardware.data || hardware) as any;
  const nodeName = hardware.node || "Unknown Node";
  const children = hardwareData.children || [];

  const memoryItems = findInTree(children, (item: any) =>
    item.id === "memory" && item.description === "System Memory"
  );

  let totalMemory = 0;
  memoryItems.forEach((mem: any) => {
    if (mem.size && mem.units === "bytes") {
      totalMemory += Number(mem.size);
    }
  });

  const memory = totalMemory > 0 ? formatMemory(totalMemory) : formatMemory(hardwareData.memory);

  const disks = findInTree(children, (item: any) =>
    item.class === "disk" || (item.id && item.id.toString().startsWith("disk"))
  );

  const networkCards = findInTree(children, (item: any) => item.class === "network");

  const motherboardItems = findInTree(children, (item: any) => item.description === "Motherboard");
  const motherboardFromTree = motherboardItems.length > 0 ? motherboardItems[0] : null;
  const motherboardDirect = hardwareData.motherboard;

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
      if (motherboardFromTree.version) parts.push(`v${motherboardFromTree.version}`);
      return parts.length > 0 ? parts.join(" ") : "N/A";
    }
    return "N/A";
  };

  const biosItems = findInTree(children, (item: any) =>
    item.id === "firmware" && item.description === "BIOS"
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

  const cpuItems = findInTree(children, (item: any) =>
    item.id === "cpu" || item.class === "processor"
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

  const formatCPUCores = (): string => {
    if (cpuItems.length === 0) return "N/A";

    const cpu = cpuItems[0];
    if (!cpu.configuration) return "N/A";

    const config = cpu.configuration;
    const parts: string[] = [];
    const multiplier = cpuItems.length;

    if (config.cores) {
      const totalCores = parseInt(config.cores) * multiplier;
      parts.push(`${totalCores} cores`);
    }
    if (config.threads) {
      const totalThreads = parseInt(config.threads) * multiplier;
      parts.push(`${totalThreads} threads`);
    }

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const formatCPUFrequency = (): string => {
    if (cpuItems.length === 0) return "N/A";

    const cpu = cpuItems[0];
    const parts: string[] = [];

    if (cpu.size && cpu.units === "Hz") {
      const ghz = cpu.size / 1000000000;
      parts.push(`${ghz.toFixed(2)} GHz`);
    }
    if (cpu.capacity && cpu.units === "Hz") {
      const maxGhz = cpu.capacity / 1000000000;
      parts.push(`(max ${maxGhz.toFixed(2)} GHz)`);
    }

    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  const formattedDisks: FormattedDisk[] = disks.map((disk: any) => {
    const deviceName = Array.isArray(disk.logicalname)
      ? disk.logicalname[0]
      : disk.logicalname || disk.dev || "N/A";

    return {
      device: deviceName,
      product: disk.product || "N/A",
      vendor: disk.vendor || "N/A",
      size: disk.size && disk.units === "bytes" ? formatMemory(disk.size) : "N/A",
    };
  });

  const formattedNetworkCards: FormattedNetworkCard[] = networkCards.map((card: any) => {
    const link = card.configuration?.link;
    const linkStatus =
      link === true || link === "yes" ? "Up" :
      link === false || link === "no" ? "Down" :
      typeof link === "string" ? link :
      "N/A";

    const linkColor = linkStatus === "Up"
      ? { color: "#3e8635" }
      : linkStatus === "Down"
      ? { color: "#c9190b" }
      : {};

    const product = formatProductName(card.product);

    const interfaceName = Array.isArray(card.logicalname)
      ? card.logicalname[0]
      : card.logicalname || card.id || "N/A";

    const speed = card.configuration?.speed || (card.size ? `${(card.size / 1000000000).toFixed(0)}Gbit/s` : "N/A");

    return {
      vendor: card.vendor || "N/A",
      product,
      interfaceName,
      linkStatus,
      linkColor,
      speed,
      firmwareVersion: card.configuration?.firmware || card.version || "N/A",
    };
  });

  return {
    nodeName,
    error: hardware.error,
    product: hardwareData.product || "N/A",
    vendor: hardwareData.vendor || "N/A",
    motherboard: formatMotherboard(),
    bios: formatBIOS(),
    cpu: formatCPU(),
    cpuCoresThreads: formatCPUCores(),
    cpuFrequency: formatCPUFrequency(),
    memory,
    disks: formattedDisks,
    networkCards: formattedNetworkCards,
  };
}
