import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DeviceStats({stats}) {

  const deviceCount = stats.reduce((acc, stat) => {
    if(acc[stat.device]) {
      acc[stat.device]++
    } else {
      acc[stat.device] = 1
    }
    return acc
   }, {})

  const result = Object.entries(deviceCount).map((device) => ({device, count: deviceCount[device[0]]}))

  return (
        <div style={{width: "100%", height: 300}}>
          <ResponsiveContainer>
            <PieChart
              width={700}
              height={400}
              responsive
            >
              <Pie
                data={result}
                labelLine={false}
                label={({device, percent}) => `${device}: (${(percent * 100).toFixed(0)}%)`}
                dataKey="count"
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