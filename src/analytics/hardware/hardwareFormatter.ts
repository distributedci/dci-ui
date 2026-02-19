function flattenObject(
  obj: IKernelDataParams,
  parentKey = "",
  out: Record<string, string> = {},
): Record<string, string> {
  for (const [key, value] of Object.entries(obj || {})) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "string") {
      out[newKey] = value;
    } else {
      if (value !== undefined) flattenObject(value, newKey, out);
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

type NodeRole = "director" | "worker" | "unknown";

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

export interface NetworkInterface {
  autonegotiation: boolean;
  businfo: string;
  description: string;
  device_id: string;
  driver: string;
  driver_version: string;
  duplex: string | null;
  firmware: string;
  firmware_ncsi?: string;
  firmware_psid?: string;
  firmware_nvm?: string;
  firmware_version: string;
  is_virtual_function: boolean;
  link_status: boolean;
  logical_name: string;
  model: string;
  speed_mbps: number | null;
  subdevice_id: string | null;
  subproduct: string | null;
  subvendor: string | null;
  subvendor_id: string | null;
  vendor: string;
  vendor_id: string;
}

export interface StorageDevice {
  businfo: string;
  description: string;
  device_id: string | null;
  firmware: string | null;
  model: string;
  size_gb: number;
  type: string;
  vendor: string;
  vendor_id: string | null;
  version: string;
}

export interface IHardware {
  bios_date: string;
  bios_type: string;
  bios_vendor: string;
  bios_version: string;
  cpu_frequency_mhz: number;
  cpu_model: string;
  cpu_sockets: number;
  cpu_total_cores: number;
  cpu_total_threads: number;
  cpu_vendor: string;
  filename: string;
  memory_dimm_count: number;
  memory_total_gb: number;
  network_interfaces: NetworkInterface[];
  node: string;
  storage_devices: StorageDevice[];
  system_family: string;
  system_model: string;
  system_sku: string;
  system_vendor: string;
}

export type IKernelDataParams =
  | string
  | string[]
  | undefined
  | { [key: string]: IKernelDataParams };

export interface IKernelData {
  node: string;
  version: string;
  params?: IKernelDataParams;
}

export interface ESNode {
  node?: string;
  hardware: IHardware;
  kernel?: IKernelData;
}

export interface INodeKernel {
  version: string;
  params: Record<string, string>;
}

export interface INode {
  name: string;
  role: NodeRole;
  nodeIndex: number;
  kernel: INodeKernel | null;
  hardware: IHardware;
}

function extractNodeIndex(nodeName: string): number {
  const match = nodeName.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function orderNodes(nodes: INode[]): INode[] {
  const roleOrder: Record<NodeRole, number> = {
    director: 0,
    worker: 1,
    unknown: 2,
  };

  return [...nodes].sort((a, b) => {
    const roleComparison = roleOrder[a.role] - roleOrder[b.role];
    if (roleComparison !== 0) {
      return roleComparison;
    }
    return a.nodeIndex - b.nodeIndex;
  });
}

export function formatHardwareData(
  ESNodes: ESNode[] | null | undefined,
): INode[] {
  if (!ESNodes) return [];
  const nodes: INode[] = [];

  for (const node of ESNodes) {
    const nodeName = node.node || node.hardware.node;
    nodes.push({
      name: nodeName,
      role: getNodeRole(nodeName),
      nodeIndex: extractNodeIndex(nodeName),
      kernel: node.kernel === undefined ? null : _parseKernelNode(node.kernel),
      hardware: node.hardware,
    });
  }

  return orderNodes(nodes);
}
