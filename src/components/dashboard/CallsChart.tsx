import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "9 AM", calls: 12 },
  { time: "10 AM", calls: 19 },
  { time: "11 AM", calls: 27 },
  { time: "12 PM", calls: 15 },
  { time: "1 PM", calls: 22 },
  { time: "2 PM", calls: 31 },
  { time: "3 PM", calls: 24 },
  { time: "4 PM", calls: 18 },
  { time: "5 PM", calls: 14 },
];

export function CallsChart() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border/50">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-card-foreground tracking-tight">
          Call Volume Today
        </h3>
        <p className="text-sm text-muted-foreground tracking-tight">
          Hourly breakdown of incoming calls
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#77acb1"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#77acb1"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(0, 0%, 90%)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0, 0%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0, 0%, 45%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(0, 0%, 90%)",
                borderRadius: "8px",
                boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              labelStyle={{ color: "hsl(0, 0%, 0%)", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#77acb1"
              strokeWidth={2}
              fill="url(#colorCalls)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
