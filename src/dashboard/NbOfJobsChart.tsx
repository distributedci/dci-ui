import {
  global_danger_color_100,
  global_success_color_100,
} from "@patternfly/react-tokens";
import { IStat } from "types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type NbOfJobsChartProps = {
  stat: IStat | null;
};

export default function NbOfJobsChart({ stat }: NbOfJobsChartProps) {
  if (stat === null) return null;
  const title = stat.nbOfJobs.toString();
  const subTitle = `remoteci${stat.nbOfJobs > 1 ? "s" : ""}`;
  const data = [
    { x: "Number of successful jobs", y: stat.percentageOfSuccess },
    { x: "Number of failed jobs", y: 100 - stat.percentageOfSuccess },
  ];
  const colors = [
    global_success_color_100.value,
    global_danger_color_100.value,
  ];
  return (
    <PieChart width={212} height={278}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="y"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
