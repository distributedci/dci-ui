import { render } from "__tests__/renders";
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
