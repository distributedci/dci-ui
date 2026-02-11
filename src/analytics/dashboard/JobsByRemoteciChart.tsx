import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  chart_color_green_300,
  chart_color_red_orange_300,
} from "@patternfly/react-tokens";
import type { IRemoteciStat } from "./dashboardUtils";

interface JobsByRemoteciChartProps {
  data: IRemoteciStat[];
}

export default function JobsByRemoteciChart({ data }: JobsByRemoteciChartProps) {
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
        <Legend />
        <Bar dataKey="success" stackId="a" fill={chart_color_green_300.var} name="Success" />
        <Bar dataKey="failure" stackId="a" fill={chart_color_red_orange_300.var} name="Failure" />
      </BarChart>
    </ResponsiveContainer>
  );
}
