import { Car, Wrench, AlertTriangle, Calendar, Fuel, Users, TrendingUp, Coins, Loader2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import VehicleStatusChart from '@/components/dashboard/VehicleStatusChart';
import MaintenanceCostChart from '@/components/dashboard/MaintenanceCostChart';
import FuelConsumptionChart from '@/components/dashboard/FuelConsumptionChart';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import RecentVehicles from '@/components/dashboard/RecentVehicles';
import { formatNumber } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { t } = useTranslation();
  const { formatMoney } = usePreferences();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in-up opacity-0 stagger-1">
          <StatCard
            title={t('dashboard.stats.totalVehicles')}
            value={stats?.totalVehicles || 0}
            icon={<Car className="h-6 w-6" />}
            variant="primary"
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-2">
          <StatCard
            title={t('dashboard.stats.inMaintenance')}
            value={stats?.inMaintenance || 0}
            icon={<Wrench className="h-6 w-6" />}
            variant="warning"
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-3">
          <StatCard
            title={t('dashboard.stats.breakdowns')}
            value={stats?.breakdowns || 0}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="danger"
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-4">
          <StatCard
            title={t('dashboard.stats.availability')}
            value={`${stats?.availabilityRate || 0}%`}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
          />
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in-up opacity-0 stagger-2">
          <StatCard
            title={t('dashboard.stats.activeReservations')}
            value={stats?.activeReservations || 0}
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-3">
          <StatCard
            title={t('dashboard.stats.monthlyFuel')}
            value={`${formatNumber(stats?.monthlyFuel || 0)} L`}
            icon={<Fuel className="h-6 w-6" />}
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-4">
          <StatCard
            title={t('dashboard.stats.activeDrivers')}
            value={stats?.activeDrivers || 0}
            icon={<Users className="h-6 w-6" />}
          />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-5">
          <StatCard
            title={t('dashboard.stats.monthlyCosts')}
            value={formatMoney(stats?.monthlyCosts || 0)}
            icon={<Coins className="h-6 w-6" />}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up opacity-0 stagger-3">
          <VehicleStatusChart />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-4">
          <MaintenanceCostChart />
        </div>
      </div>

      {/* Fuel and Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in-up opacity-0 stagger-4">
          <FuelConsumptionChart />
        </div>
        <div className="animate-fade-in-up opacity-0 stagger-5">
          <RecentAlerts />
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="animate-fade-in-up opacity-0 stagger-6">
        <RecentVehicles />
      </div>
    </div>
  );
};

export default Dashboard;
