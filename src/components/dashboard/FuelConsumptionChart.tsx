import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const data = [
  { month: 'Jan', diesel: 2400, essence: 1200 },
  { month: 'Fév', diesel: 2100, essence: 1100 },
  { month: 'Mar', diesel: 2800, essence: 1400 },
  { month: 'Avr', diesel: 2600, essence: 1300 },
  { month: 'Mai', diesel: 3100, essence: 1600 },
  { month: 'Juin', diesel: 2900, essence: 1450 },
];

const FuelConsumptionChart = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{t('dashboard.charts.fuelConsumption')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.charts.last6Months')}</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} L`,
                name === 'diesel' ? t('dashboard.charts.diesel') : t('dashboard.charts.gasoline'),
              ]}
            />
            <Bar
              dataKey="diesel"
              fill="hsl(221 83% 53%)"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="essence"
              fill="hsl(142 76% 36%)"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-primary" />
          <span className="text-sm text-muted-foreground">{t('dashboard.charts.diesel')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-sm text-muted-foreground">{t('dashboard.charts.gasoline')}</span>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumptionChart;
