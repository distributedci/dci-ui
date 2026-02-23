import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  type PieLabel,
} from "recharts";
import type { IStat } from "analytics/jobsStats/jobStats";

const RADIAN = Math.PI / 180;

const CustomLabel: PieLabel = (props) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  } = props as unknown as {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  };
  const cxN = Number(cx);
  const inner = Number(innerRadius);
  const outer = Number(outerRadius);
  const radius = inner + (outer - inner) * 0.5;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 4 / 100) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cxN ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { label: string; value: number; total: number; fill: string };
  }>;
}) => {
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
        <p style={{ color: p.fill }}>{`${p.label}: ${p.value}% (${p.total})`}</p>
      </div>
    );
  }

  return null;
};

interface TopicsPieChartProps {
  stat: Record<string, IStat>;
}

export default function TopicsPieChart({ stat }: TopicsPieChartProps) {
  const nbJobs = Object.values(stat).reduce((acc, status) => {
    acc += status.total;
    return acc;
  }, 0);

  if (nbJobs === 0) {
    return (
      <div className="pf-v6-u-text-align-center pf-v6-u-py-xl">
        No data available
      </div>
    );
  }

  const data = Object.values(stat).map((status) => {
    return { ...status, value: Math.round((status.total * 100) / nbJobs) };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" labelLine={false} label={CustomLabel}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
