import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chart_color_blue_300 } from "@patternfly/react-tokens";
import type { IProductStat } from "./dashboardUtils";

interface JobsByProductChartProps {
  data: IProductStat[];
}

export default function JobsByProductChart({ data }: JobsByProductChartProps) {
  if (data.length === 0) {
    return (
      <div className="pf-v6-u-text-align-center pf-v6-u-py-xl">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill={chart_color_blue_300.var} name="Jobs" />
      </BarChart>
    </ResponsiveContainer>
  );
}
