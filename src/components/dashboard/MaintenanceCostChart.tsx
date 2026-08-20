import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';

const data = [
  { month: 'Jan', cost: 2400000 },
  { month: 'Fév', cost: 1398000 },
  { month: 'Mar', cost: 3800000 },
  { month: 'Avr', cost: 3908000 },
  { month: 'Mai', cost: 4800000 },
  { month: 'Juin', cost: 3800000 },
  { month: 'Juil', cost: 4300000 },
  { month: 'Août', cost: 2100000 },
  { month: 'Sep', cost: 3200000 },
  { month: 'Oct', cost: 2800000 },
  { month: 'Nov', cost: 3600000 },
  { month: 'Déc', cost: 4100000 },
];

const totalCost = data.reduce((sum, item) => sum + item.cost, 0);

const MaintenanceCostChart = () => {
  const { t } = useTranslation();
  const { formatMoney } = usePreferences();
  
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{t('dashboard.charts.maintenanceCosts')}</h3>
          <p className="text-sm text-muted-foreground">{t('dashboard.charts.monthlyEvolution')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-card-foreground">{formatMoney(totalCost)}</p>
          <p className="text-sm text-success">{t('dashboard.charts.thisYear')}</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
              }}
              formatter={(value: number) => [formatMoney(value), t('dashboard.charts.cost')]}
              labelFormatter={(label) => `${t('dashboard.charts.month')}: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="hsl(221 83% 53%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCost)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaintenanceCostChart;
