import {
  Card,
  CardBody,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import type {
  IHardware,
  INode,
  INodeKernel,
} from "analytics/hardware/hardwareFormatter";

function KernelSection({ kernel }: { kernel: INodeKernel }) {
  const params = Object.entries(kernel.params)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  return (
    <>
      <DescriptionListGroup>
        <DescriptionListTerm>Kernel</DescriptionListTerm>
        <DescriptionListDescription>
          {kernel.version}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Params</DescriptionListTerm>
        <DescriptionListDescription>{params}</DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
}

const formatSystem = (hardware: IHardware) => {
  const parts: string[] = [];
  if (hardware.system_vendor) parts.push(hardware.system_vendor);
  if (hardware.system_model) parts.push(hardware.system_model);
  if (hardware.system_sku) parts.push(`(sku: ${hardware.system_sku})`);
  return parts.length > 0 ? parts.join(" ") : "N/A";
};

const formatBios = (hardware: IHardware) => {
  const parts: string[] = [];
  if (hardware.bios_vendor) parts.push(hardware.bios_vendor);
  if (hardware.bios_version) parts.push(hardware.bios_version);
  if (hardware.bios_date) parts.push(`(${hardware.bios_date})`);
  return parts.length > 0 ? parts.join(" ") : "N/A";
};

const formatCPU = (hardware: IHardware): string => {
  const parts: string[] = [];
  if (hardware.cpu_model) parts.push(hardware.cpu_model);
  if (hardware.cpu_sockets > 0) parts.push(`${hardware.cpu_sockets} sockets`);
  if (hardware.cpu_total_threads > 0)
    parts.push(`${hardware.cpu_total_threads} threads`);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

const formatCPUCores = (hardware: IHardware): string => {
  if (hardware.cpu_total_cores === 0 || hardware.cpu_total_threads === 0)
    return "N/A";
  const parts: string[] = [];
  if (hardware.cpu_total_cores) {
    parts.push(`${hardware.cpu_total_cores} cores`);
  }
  if (hardware.cpu_total_threads) {
    parts.push(`${hardware.cpu_total_threads} threads`);
  }
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

const formatCPUFrequency = (hardware: IHardware): string => {
  if (hardware.cpu_frequency_mhz === 0) return "N/A";
  const ghz = hardware.cpu_frequency_mhz / 1000;
  return `${ghz.toFixed(2)} GHz`;
};

const formatMemory = (hardware: IHardware): string => {
  return `${hardware.memory_total_gb} GB`;
};

function HardwareSection({ hardware }: { hardware: IHardware }) {
  return (
    <>
      <DescriptionListGroup>
        <DescriptionListTerm>System</DescriptionListTerm>
        <DescriptionListDescription>
          {formatSystem(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>BIOS</DescriptionListTerm>
        <DescriptionListDescription>
          {formatBios(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>CPU</DescriptionListTerm>
        <DescriptionListDescription>
          {formatCPU(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Cores/Threads</DescriptionListTerm>
        <DescriptionListDescription>
          {formatCPUCores(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>CPU Frequency</DescriptionListTerm>
        <DescriptionListDescription>
          {formatCPUFrequency(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Memory</DescriptionListTerm>
        <DescriptionListDescription>
          {formatMemory(hardware)}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
}

function DiskSection({ disks }: { disks: IHardware["storage_devices"] }) {
  return (
    <div>
      <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
        Disks
      </Content>
      <Table variant="compact" borders={false}>
        <Thead>
          <Tr>
            <Th>Vendor</Th>
            <Th>Description</Th>
            <Th>Model</Th>
            <Th>Size</Th>
          </Tr>
        </Thead>
        <Tbody>
          {disks.map((disk, index) => (
            <Tr key={index}>
              <Td>{disk.vendor}</Td>
              <Td>{disk.description}</Td>
              <Td style={{ textTransform: "capitalize" }}>
                {disk.model.toLowerCase()}
              </Td>
              <Td>{`${disk.size_gb} GB`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

function NetworkCardSection({
  cards,
}: {
  cards: IHardware["network_interfaces"];
}) {
  return (
    <div>
      <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
        Network Cards
      </Content>
      <Table variant="compact" borders={false}>
        <Thead>
          <Tr>
            <Th>Vendor</Th>
            <Th>Interface Name</Th>
            <Th className="text-center">Link Status</Th>
            <Th className="text-center">Speed</Th>
            <Th>Firmware Version</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cards.map((card, index) => (
            <Tr key={index}>
              <Td>{card.vendor}</Td>
              <Td>{card.logical_name}</Td>
              <Td
                className="text-center"
                style={{
                  color: card.link_status ? "green" : "red",
                }}
              >
                {card.link_status ? "up" : "down"}
              </Td>
              <Td className="text-center">
                {card.speed_mbps !== null && `${card.speed_mbps} MBps`}
              </Td>
              <Td>{card.firmware}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default function JobHardwareNode({ node }: { node: INode }) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h3} className="pf-v6-u-mb-md">
          {node.role === "director"
            ? "Director"
            : node.role === "worker"
              ? "Worker"
              : ""}{" "}
          {node.name}
        </Content>
        <DescriptionList isHorizontal>
          {node.kernel !== null && <KernelSection kernel={node.kernel} />}
          {node.hardware !== null && (
            <HardwareSection hardware={node.hardware} />
          )}
          {node.hardware && node.hardware.storage_devices.length > 0 && (
            <DiskSection disks={node.hardware.storage_devices} />
          )}
          {node.hardware && node.hardware.network_interfaces.length > 0 && (
            <NetworkCardSection cards={node.hardware.network_interfaces} />
          )}
        </DescriptionList>
      </CardBody>
    </Card>
  );
}
