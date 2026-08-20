import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useVehicleStatusData } from '@/hooks/useDashboardStats';
import { Loader2 } from 'lucide-react';

const VehicleStatusChart = () => {
  const { data, isLoading } = useVehicleStatusData();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-card h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = data || [];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">État de la flotte</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Aucun véhicule enregistré
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">État de la flotte</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
              }}
              formatter={(value: number, name: string) => [`${value} véhicules`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="ml-auto text-sm font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleStatusChart;
