import { render } from "__tests__/renders";
import { within } from "@testing-library/react";
import nodesData from "analytics/hardware/__tests__/fixtures/nodes.json";
import { formatHardwareData } from "analytics/hardware/hardwareFormatter";
import JobHardwareNode from "./JobHardwareNode";

test("Should format Cores/Threads, CPU frequency and memory correctly", async () => {
  const nodes = formatHardwareData(nodesData);
  const { findByText } = render(<JobHardwareNode node={nodes[0]} />);

  expect(await findByText(/Director master-0/i)).toBeInTheDocument();
  expect(await findByText(/512 GB/i)).toBeInTheDocument();
  expect(await findByText(/3.60 GHz/i)).toBeInTheDocument();
  expect(await findByText(/40 cores, 80 threads/i)).toBeInTheDocument();
});

test.each([
  [{ vendor: "Dell", version: "7.10.30.00" }, "Dell 7.10.30.00"],
  [{ vendor: "Dell", version: null }, "Dell"],
  [{ vendor: null, version: "7.10.30.00" }, "7.10.30.00"],
  [{ vendor: null, version: null }, "N/A"],
  [null, "N/A"],
  [undefined, "N/A"],
])("Should display BMC information for %j", (bmc, expected) => {
  const [node] = formatHardwareData(nodesData);
  node.hardware = { ...node.hardware, bmc };
  const { getByText } = render(<JobHardwareNode node={node} />);

  const group = getByText("BMC").closest("div")!;
  expect(within(group).getByText(expected)).toBeInTheDocument();
});
