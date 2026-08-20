import { Car, MoreVertical, Loader2 } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRecentVehicles } from '@/hooks/useDashboardStats';
import { useQuery } from '@tanstack/react-query';
import type { VehicleStatus } from '@/services/api/types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const statusConfig: Record<VehicleStatus, { labelKey: string; className: string }> = {
  'Disponible': { labelKey: 'status.available', className: 'bg-success/10 text-success border-success/20' },
  'En mission': { labelKey: 'status.onMission', className: 'bg-primary/10 text-primary border-primary/20' },
  'En entretien': { labelKey: 'status.inMaintenance', className: 'bg-warning/10 text-warning border-warning/20' },
  'En panne': { labelKey: 'status.brokenDown', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const RecentVehicles = () => {
  const { data: vehicles = [], isLoading } = useRecentVehicles();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-card h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{t('dashboard.recentVehicles.title')}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary"
          onClick={() => navigate('/vehicles')}
        >
          {t('dashboard.recentVehicles.viewAll')}
        </Button>
      </div>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('dashboard.recentVehicles.noData')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('dashboard.recentVehicles.columns.vehicle')}
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('dashboard.recentVehicles.columns.registration')}
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('dashboard.recentVehicles.columns.status')}
                </th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('dashboard.recentVehicles.columns.fuel')}
                </th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('dashboard.recentVehicles.columns.mileage')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((vehicle: any, index: number) => (
                <tr
                  key={vehicle.id}
                  className="group transition-colors hover:bg-muted/50 animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{vehicle.brand}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-mono text-sm text-card-foreground">{vehicle.registration}</span>
                  </td>
                  <td className="py-4">
                    <Badge
                      variant="outline"
                      className={cn('font-medium', statusConfig[vehicle.status as VehicleStatus]?.className)}
                    >
                      {statusConfig[vehicle.status as VehicleStatus] ? t(statusConfig[vehicle.status as VehicleStatus].labelKey) : vehicle.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-muted-foreground">{vehicle.fuel_type}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-medium text-card-foreground">
                      {formatNumber(vehicle.mileage)} km
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentVehicles;
