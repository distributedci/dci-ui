import { render } from "__tests__/renders";
import hardwareData from "analytics/hardware/__tests__/fixtures/hardware-data.json";
import { formatHardwareData } from "analytics/hardware/hardwareFormatter";
import JobHardwareNode from "./JobHardwareNode";

test("Should format Cores/Threads, CPU frequency and memory correctly", async () => {
  const nodes = formatHardwareData(hardwareData);
  const { findByText } = render(<JobHardwareNode node={nodes[0]} />);

  expect(
    await findByText(/Worker worker-0.test-lab.example.com/i),
  ).toBeInTheDocument();
  expect(await findByText(/384 GB/i)).toBeInTheDocument();
  expect(await findByText(/3.00 GHz/i)).toBeInTheDocument();
  expect(await findByText(/48 cores, 96 threads/i)).toBeInTheDocument();
  expect(await findByText(/446.63 GB/i)).toBeInTheDocument();
});
