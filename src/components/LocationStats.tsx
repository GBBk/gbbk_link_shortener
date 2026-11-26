import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { countBy } from "@/lib/links";
import type { Click } from "@/types";

export default function LocationStats({ stats }: { stats: Click[] }) {
  const cities = countBy(stats, (stat) => stat.city).map(({ name, count }) => ({ city: name, count }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          width={700}
          height={300}
          data={cities.slice(0, 5)}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="city" />
          <YAxis allowDecimals={false} />
          <Tooltip labelStyle={{ color: "green" }} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
