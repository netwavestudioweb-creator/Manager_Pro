import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatCard = ({ title, value, icon, trend, variant = 'default', className }: StatCardProps) => {
  const { t } = useTranslation();
  const variants = {
    default: 'bg-card',
    primary: 'gradient-primary text-primary-foreground',
    success: 'gradient-success text-success-foreground',
    warning: 'gradient-warning text-warning-foreground',
    danger: 'gradient-danger text-destructive-foreground',
  };

  const iconBg = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    success: 'bg-success-foreground/20 text-success-foreground',
    warning: 'bg-warning-foreground/20 text-warning-foreground',
    danger: 'bg-destructive-foreground/20 text-destructive-foreground',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-glow',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
            )}
          >
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span
                className={cn(
                  'text-sm',
                  variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
                )}
              >
                {t('dashboard.stats.vsLastMonth')}
              </span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconBg[variant])}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
