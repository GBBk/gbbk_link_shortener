import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { countBy } from "@/lib/links";
import type { Click } from "@/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DeviceStats({ stats }: { stats: Click[] }) {
  const result = countBy(stats, (stat) => stat.device);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={result}
            labelLine={false}
            label={({ name, percent }) => `${name}: (${((percent ?? 0) * 100).toFixed(0)}%)`}
            dataKey="count"
            nameKey="name"
          >
            {result.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
