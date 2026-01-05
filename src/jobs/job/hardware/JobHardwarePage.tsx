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
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useJob } from "../jobContext";
import { useGetJobHardwareDataQuery } from "analytics/hardware/hardwareApi";
import { EmptyState, BlinkLogo } from "ui";
import type { IKernelData, IHardwareData } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  formatKernelData,
  formatHardwareData,
  type FormattedKernelData,
  type FormattedHardwareData,
} from "analytics/hardware/hardwareFormatters";

function KernelSection({ formattedKernel }: { formattedKernel: FormattedKernelData }) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h3} className="pf-v6-u-mb-md">
          Kernel - {formattedKernel.nodeName}
        </Content>
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Node</DescriptionListTerm>
            <DescriptionListDescription>
              {formattedKernel.node}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Version</DescriptionListTerm>
            <DescriptionListDescription>
              {formattedKernel.version}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Params</DescriptionListTerm>
            <DescriptionListDescription>
              {formattedKernel.params}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
}

function HardwareSection({ formattedHardware }: { formattedHardware: FormattedHardwareData }) {
  return (
    <Card>
      <CardBody>
        <Content component={ContentVariants.h3} className="pf-v6-u-mb-md">
          Hardware - {formattedHardware.nodeName}
        </Content>
        {formattedHardware.error && (
          <div className="pf-v6-u-mb-md">
            <Content component={ContentVariants.p} className="pf-v6-u-color-danger">
              Error: {formattedHardware.error}
            </Content>
          </div>
        )}
        <DescriptionList isHorizontal className="pf-v6-u-mb-md">
          <DescriptionListGroup>
            <DescriptionListTerm>Product</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.product}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Vendor</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.vendor}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Motherboard</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.motherboard}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>BIOS</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.bios}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.cpu}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU Cores/Threads</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.cpuCoresThreads}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>CPU Frequency</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.cpuFrequency}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Memory</DescriptionListTerm>
            <DescriptionListDescription>{formattedHardware.memory}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>

        {formattedHardware.disks.length > 0 && (
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
                {formattedHardware.disks.map((disk, index) => (
                  <Tr key={index}>
                    <Td>{disk.device}</Td>
                    <Td>{disk.product}</Td>
                    <Td>{disk.vendor}</Td>
                    <Td>{disk.size}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}

        {formattedHardware.networkCards.length > 0 && (
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
                {formattedHardware.networkCards.map((card, index) => (
                  <Tr key={index}>
                    <Td>{card.vendor}</Td>
                    <Td>{card.product}</Td>
                    <Td>{card.interfaceName}</Td>
                    <Td style={card.linkColor}>{card.linkStatus}</Td>
                    <Td>{card.speed}</Td>
                    <Td>{card.firmwareVersion}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function JobHardwarePage() {
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

  const { data: hardwareData, isLoading, error } = useGetJobHardwareDataQuery(
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
            title="Error loading hardware data"
            info={`Failed to load hardware data for job ${job.id}`}
          />
        </CardBody>
      </Card>
    );
  }

  if (!hardwareData) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No hardware data"
            info="No hardware data available for this job"
          />
        </CardBody>
      </Card>
    );
  }

  const nodes = Array.isArray(hardwareData) ? hardwareData : [hardwareData];

  if (nodes.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No hardware data"
            info="No kernel or hardware data available for this job"
          />
        </CardBody>
      </Card>
    );
  }

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

  const sortedNodeNames = Array.from(nodeMap.keys()).sort();

  return (
    <div>
      {sortedNodeNames.map((nodeName) => {
        const nodeData = nodeMap.get(nodeName)!;
        const kernel = nodeData.kernel;
        const hardware = nodeData.hardware;

        const hasKernelData =
          kernel && (kernel.node || kernel.version || kernel.params);
        const hardwareDataRaw = (hardware?.data || hardware) as any;
        const hasHardwareData =
          hardware &&
          (hardware.node ||
            hardwareDataRaw?.product ||
            hardwareDataRaw?.vendor ||
            hardwareDataRaw?.motherboard ||
            hardwareDataRaw?.memory ||
            hardwareDataRaw?.disks?.length ||
            hardwareDataRaw?.network_cards?.length ||
            hardwareDataRaw?.children?.length);

        if (!hasKernelData && !hasHardwareData) {
          return null;
        }

        const formattedKernel = kernel ? formatKernelData(kernel) : null;
        const formattedHardware = hardware ? formatHardwareData(hardware) : null;

        return (
          <div key={nodeName} className="pf-v6-u-mb-md">
            {formattedKernel && <KernelSection formattedKernel={formattedKernel} />}
            {formattedHardware && <HardwareSection formattedHardware={formattedHardware} />}
          </div>
        );
      })}
    </div>
  );
}
