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
  INode,
  INodeHardware,
  INodeKernel,
  IDisk,
  INetworkCard,
} from "analytics/hardware/hardwareFormatter";
import {} from "@patternfly/react-tokens";
import { humanizeBytes } from "services/bytes";

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

const formatCPUCores = (cores: number, threads: number): string => {
  if (cores === 0 || threads === 0) return "N/A";
  const parts: string[] = [];
  if (cores) {
    parts.push(`${cores} cores`);
  }
  if (threads) {
    parts.push(`${threads} threads`);
  }
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

const formatCPUFrequency = (
  cpuFrequency: number,
  cpuCapacity: number,
): string => {
  if (cpuFrequency === 0 || cpuCapacity === 0) return "N/A";

  const parts: string[] = [];

  if (cpuFrequency) {
    const ghz = cpuFrequency / 1000000000;
    parts.push(`${ghz.toFixed(2)} GHz`);
  }
  if (cpuCapacity) {
    const maxGhz = cpuCapacity / 1000000000;
    parts.push(`(max ${maxGhz.toFixed(2)} GHz)`);
  }

  return parts.length > 0 ? parts.join(" ") : "N/A";
};

function HardwareSection({ hardware }: { hardware: INodeHardware }) {
  return (
    <>
      <DescriptionListGroup>
        <DescriptionListTerm>Product</DescriptionListTerm>
        <DescriptionListDescription>
          {hardware.product}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Vendor</DescriptionListTerm>
        <DescriptionListDescription>
          {hardware.vendor}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Motherboard</DescriptionListTerm>
        <DescriptionListDescription>
          {hardware.motherboard}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>BIOS</DescriptionListTerm>
        <DescriptionListDescription>{hardware.bios}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>CPU</DescriptionListTerm>
        <DescriptionListDescription>{hardware.cpu}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Cores/Threads</DescriptionListTerm>
        <DescriptionListDescription>
          {formatCPUCores(hardware.nbCore, hardware.nbThread)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>CPU Frequency</DescriptionListTerm>
        <DescriptionListDescription>
          {formatCPUFrequency(hardware.cpuFrequency, hardware.cpuCapacity)}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Memory</DescriptionListTerm>
        <DescriptionListDescription>
          {humanizeBytes(hardware.memory)}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
}

function DiskSection({ disks }: { disks: IDisk[] }) {
  return (
    <div>
      <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
        Disks
      </Content>
      <Table variant="compact" borders={false}>
        <Thead>
          <Tr>
            <Th>Device</Th>
            <Th>Product</Th>
            <Th>Vendor</Th>
            <Th>Size</Th>
          </Tr>
        </Thead>
        <Tbody>
          {disks.map((disk, index) => (
            <Tr key={index}>
              <Td>{disk.device}</Td>
              <Td>{disk.product}</Td>
              <Td>{disk.vendor}</Td>
              <Td>{humanizeBytes(disk.size)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

function NetworkCardSection({ cards }: { cards: INetworkCard[] }) {
  return (
    <div>
      <Content component={ContentVariants.h4} className="pf-v6-u-mb-sm">
        Network Cards
      </Content>
      <Table variant="compact" borders={false}>
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
          {cards.map((card, index) => (
            <Tr key={index}>
              <Td>{card.vendor}</Td>
              <Td>{card.product}</Td>
              <Td>{card.interfaceName}</Td>
              <Td
                style={{
                  color:
                    card.linkStatus === "up"
                      ? "green"
                      : card.linkStatus === "down"
                        ? "red"
                        : "inherit",
                }}
              >
                {card.linkStatus}
              </Td>
              <Td>{card.speed}</Td>
              <Td>{card.firmwareVersion}</Td>
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
          {node.hardware && node.hardware.disks.length > 0 && (
            <DiskSection disks={node.hardware.disks} />
          )}
          {node.hardware && node.hardware.networkCards.length > 0 && (
            <NetworkCardSection cards={node.hardware.networkCards} />
          )}
        </DescriptionList>
      </CardBody>
    </Card>
  );
}
