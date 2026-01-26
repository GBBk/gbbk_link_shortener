import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

export default function LocationStats({stats}) {

  const cityCount = stats.reduce((acc, stat) => {
    if(acc[stat.city]) {
      acc[stat.city]++
    } else {
      acc[stat.city] = 1
    }
    return acc
   }, {})

  const cities = Object.entries(cityCount).map(([city, count]) => ({city, count}))

  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <LineChart
          width={700}
          height={300}
          responsive
          data={cities.slice(0, 5)}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          >
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip labelStyle={{color: "green"}} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
          <RechartsDevtools />
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
}