import {
  Card,
  CardBody,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Bullseye,
} from "@patternfly/react-core";
import {
  chart_color_green_300,
  chart_color_red_orange_300,
} from "@patternfly/react-tokens";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useJob } from "../jobContext";
import { useGetJobExtraDataQuery } from "jobs/jobsApi";
import { EmptyState, BlinkLogo } from "ui";
import type { IKernelData, IHardwareData } from "types";
import { skipToken } from "@reduxjs/toolkit/query";

function formatMemory(memory: number | { amount?: number } | undefined): string {
  if (!memory) return "N/A";
  const amount = typeof memory === "number" ? memory : memory.amount || 0;
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
  
  // Handle primitive types (including empty strings)
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [`${prefix}=${value}`];
  }
  
  // Handle nested objects by flattening with dot notation
  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    // If object is empty, still include it
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
  
  // For arrays or other types, stringify them
  return [`${prefix}=${JSON.stringify(value)}`];
}

function formatKernelParams(params: string | Record<string, any> | undefined): string {
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

function KernelSection({ kernel }: { kernel: IKernelData }) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h3} className="pf-v6-u-mb-md">
          Kernel - {kernel.node || "Unknown Node"}
        </Content>
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Node</DescriptionListTerm>
            <DescriptionListDescription>
              {kernel.node || "N/A"}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Version</DescriptionListTerm>
            <DescriptionListDescription>
              {kernel.version || "N/A"}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Params</DescriptionListTerm>
            <DescriptionListDescription>
              {formatKernelParams(kernel.params)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
}

function HardwareSection({ hardware }: { hardware: IHardwareData }) {
  // Handle new structure: hardware.data contains the actual hardware info
  const hardwareData = (hardware.data || hardware) as any;
  const nodeName = hardware.node || "Unknown Node";
  
  // Extract disks and network cards from children array
  const children = hardwareData.children || [];
  
  // Recursive function to find all items with a specific class/id in the tree
  const findInTree = (items: any[], predicate: (item: any) => boolean): any[] => {
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
  };
  
  // Find system memory (id === "memory", not cache)
  const memoryItems = findInTree(children, (item: any) => 
    item.id === "memory" && item.description === "System Memory"
  );
  
  // Calculate total memory from memory items
  let totalMemory = 0;
  memoryItems.forEach((mem: any) => {
    if (mem.size && mem.units === "bytes") {
      totalMemory += Number(mem.size);
    }
  });
  
  const memory = totalMemory > 0 ? formatMemory(totalMemory) : formatMemory(hardwareData.memory);

  // Extract disks - look for class === "disk" or id starting with "disk"
  const disks = findInTree(children, (item: any) =>
    item.class === "disk" || (item.id && item.id.toString().startsWith("disk"))
  );
  
  // Extract network cards - look for class === "network"
  const networkCards = findInTree(children, (item: any) => item.class === "network");
  
  // Extract motherboard - look for description === "Motherboard" or use direct property
  const motherboardItems = findInTree(children, (item: any) => item.description === "Motherboard");
  const motherboardFromTree = motherboardItems.length > 0 ? motherboardItems[0] : null;
  const motherboardDirect = hardwareData.motherboard;
  
  // Format motherboard info
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
  
  // Extract BIOS info - look for id === "firmware" and description === "BIOS"
  const biosItems = findInTree(children, (item: any) =>
    item.id === "firmware" && item.description === "BIOS"
  );
  const bios = biosItems.length > 0 ? biosItems[0] : null;

  // Format BIOS info
  const formatBIOS = (): string => {
    if (!bios) return "N/A";
    const parts: string[] = [];
    if (bios.vendor) parts.push(bios.vendor);
    if (bios.version) parts.push(bios.version);
    if (bios.date) parts.push(`(${bios.date})`);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  // Extract CPU info - look for id === "cpu" or class === "processor"
  const cpuItems = findInTree(children, (item: any) =>
    item.id === "cpu" || item.class === "processor"
  );

  // Format CPU info with count if multiple CPUs
  const formatCPU = (): string => {
    if (cpuItems.length === 0) return "N/A";

    const cpu = cpuItems[0];
    const parts: string[] = [];

    // Add count prefix if multiple CPUs
    if (cpuItems.length > 1) {
      parts.push(`${cpuItems.length} x`);
    }

    if (cpu.vendor) parts.push(cpu.vendor);
    if (cpu.product) parts.push(cpu.product);

    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  // Format CPU cores/threads (using first CPU as they're typically identical)
  const formatCPUCores = (): string => {
    if (cpuItems.length === 0) return "N/A";

    const cpu = cpuItems[0];
    if (!cpu.configuration) return "N/A";

    const config = cpu.configuration;
    const parts: string[] = [];

    // Multiply by number of CPUs if multiple
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

  // Format CPU frequency (using first CPU as they're typically identical)
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

  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h3} className="pf-v6-u-mb-md">
          Hardware - {nodeName}
        </Content>
        {hardware.error && (
          <div className="pf-v6-u-mb-md">
            <Content component={ContentVariants.p} className="pf-v6-u-color-danger">
              Error: {hardware.error}
            </Content>
          </div>
        )}
        <DescriptionList isHorizontal className="pf-v6-u-mb-md">
          <DescriptionListGroup>
            <DescriptionListTerm>Product</DescriptionListTerm>
            <DescriptionListDescription>{hardwareData.product || "N/A"}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Vendor</DescriptionListTerm>
            <DescriptionListDescription>{hardwareData.vendor || "N/A"}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Motherboard</DescriptionListTerm>
            <DescriptionListDescription>{formatMotherboard()}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>BIOS</DescriptionListTerm>
            <DescriptionListDescription>{formatBIOS()}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU</DescriptionListTerm>
            <DescriptionListDescription>{formatCPU()}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU Cores/Threads</DescriptionListTerm>
            <DescriptionListDescription>{formatCPUCores()}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU Frequency</DescriptionListTerm>
            <DescriptionListDescription>{formatCPUFrequency()}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Memory</DescriptionListTerm>
            <DescriptionListDescription>{memory}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>

        {disks.length > 0 && (
          <div className="pf-v6-u-mb-md">
            <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
              Disks
            </Content>
            <Table>
              <Thead>
                <Tr>
                  <Th>Device</Th>
                  <Th>Product</Th>
                  <Th>Vendor</Th>
                  <Th>Size</Th>
                </Tr>
              </Thead>
              <Tbody>
                {disks.map((disk: any, index: number) => {
                  // Handle logicalname which can be a string or an array
                  const deviceName = Array.isArray(disk.logicalname)
                    ? disk.logicalname[0]
                    : disk.logicalname || disk.dev || "N/A";

                  return (
                    <Tr key={index}>
                      <Td>{deviceName}</Td>
                      <Td>{disk.product || "N/A"}</Td>
                      <Td>{disk.vendor || "N/A"}</Td>
                      <Td>{disk.size && disk.units === "bytes" ? formatMemory(disk.size) : "N/A"}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        )}

        {networkCards.length > 0 && (
          <div>
            <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
              Network Cards
            </Content>
            <Table>
              <Thead>
                <Tr>
                  <Th>Vendor</Th>
                  <Th>Product</Th>
                  <Th>Interface Name</Th>
                  <Th>Link Status</Th>
                  <Th>Speed</Th>
                  <Th>Firmware Version</Th>
                </Tr>
              </Thead>
              <Tbody>
                {networkCards.map((card: any, index: number) => {
                  // Handle link status - can be boolean (true/false) or string ("yes"/"no")
                  const link = card.configuration?.link;
                  const linkStatus =
                    link === true || link === "yes" ? "Up" :
                    link === false || link === "no" ? "Down" :
                    typeof link === "string" ? link :
                    "N/A";
                  const linkColor = linkStatus === "Up"
                    ? { color: chart_color_green_300.value }
                    : linkStatus === "Down"
                    ? { color: chart_color_red_orange_300.value }
                    : {};
                  
                  // Remove PCI vendor ID from product but keep device ID (format: "Product Name [vendor_id:device_id]" -> "Product Name [device_id]")
                  const product = card.product
                    ? card.product.replace(/\s*\[[0-9A-Fa-f]{4}:([0-9A-Fa-f]{4})\]\s*/g, " [$1]").trim()
                    : "N/A";

                  // Handle logicalname which can be a string or an array
                  const interfaceName = Array.isArray(card.logicalname)
                    ? card.logicalname[0]
                    : card.logicalname || card.id || "N/A";

                  return (
                    <Tr key={index}>
                      <Td>{card.vendor || "N/A"}</Td>
                      <Td>{product}</Td>
                      <Td>{interfaceName}</Td>
                      <Td style={linkColor}>{linkStatus}</Td>
                      <Td>{card.configuration?.speed || card.size ? `${(card.size / 1000000000).toFixed(0)}Gbit/s` : "N/A"}</Td>
                      <Td>{card.configuration?.firmware || card.version || "N/A"}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function JobExtraPage() {
  const { job } = useJob();
  
  if (!job || !job.id) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Job not available"
            info="Please wait while the job is being loaded"
          />
        </CardBody>
      </Card>
    );
  }

  const { data: extraData, isLoading, error } = useGetJobExtraDataQuery(
    job.id ? job.id : skipToken,
  );

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <Bullseye>
            <BlinkLogo />
          </Bullseye>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Error loading extra data"
            info={`Failed to load extra data for job ${job.id}`}
          />
        </CardBody>
      </Card>
    );
  }

  if (!extraData) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No extra data"
            info="No extra data available for this job"
          />
        </CardBody>
      </Card>
    );
  }

  // extraData is an array of node objects, each with kernel and/or hardware
  const nodes = Array.isArray(extraData) ? extraData : [extraData];

  if (nodes.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No extra data"
            info="No kernel or hardware data available for this job"
          />
        </CardBody>
      </Card>
    );
  }

  // Extract all unique node names and group data by node
  const nodeMap = new Map<string, { kernel?: IKernelData; hardware?: IHardwareData }>();
  
  nodes.forEach((node) => {
    const kernel = node.kernel;
    const hardware = node.hardware;
    
    const nodeName = kernel?.node || hardware?.node || "Unknown";
    
    if (!nodeMap.has(nodeName)) {
      nodeMap.set(nodeName, {});
    }
    
    const nodeData = nodeMap.get(nodeName)!;
    if (kernel) {
      nodeData.kernel = kernel;
    }
    if (hardware) {
      nodeData.hardware = hardware;
    }
  });

  // Sort node names alphabetically
  const sortedNodeNames = Array.from(nodeMap.keys()).sort();

  return (
    <div>
      {sortedNodeNames.map((nodeName) => {
        const nodeData = nodeMap.get(nodeName)!;
        const kernel = nodeData.kernel;
        const hardware = nodeData.hardware;

        const hasKernelData =
          kernel && (kernel.node || kernel.version || kernel.params);
        const hardwareData = (hardware?.data || hardware) as any;
        const hasHardwareData =
          hardware &&
          (hardware.node ||
            hardwareData?.product ||
            hardwareData?.vendor ||
            hardwareData?.motherboard ||
            hardwareData?.memory ||
            hardwareData?.disks?.length ||
            hardwareData?.network_cards?.length ||
            hardwareData?.children?.length);

        if (!hasKernelData && !hasHardwareData) {
          return null;
        }

        return (
          <div key={nodeName} className="pf-v6-u-mb-md">
            {hasKernelData && kernel && <KernelSection kernel={kernel} />}
            {hasHardwareData && hardware && <HardwareSection hardware={hardware} />}
          </div>
        );
      })}
    </div>
  );
}

