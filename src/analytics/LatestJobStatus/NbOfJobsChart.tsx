import {
  t_temp_dev_tbd as global_danger_color_100 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_success_color_100 /* CODEMODS: you should update this color token */,
} from "@patternfly/react-tokens";
import { IStat } from "types";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";

type NbOfJobsChartProps = {
  stat: IStat | null;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p style={{ color: p.fill }}>{`${p.x}: ${p.y}%`}</p>
      </div>
    );
  }

  return null;
};

export default function NbOfJobsChart({ stat }: NbOfJobsChartProps) {
  if (stat === null) return null;
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
        innerRadius={80}
        outerRadius={100}
        fill="#8884d8"
        dataKey="y"
      >
        <Label
          value={`${stat.percentageOfSuccess}% success`}
          position="center"
          fontSize="21px"
        />
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
}
