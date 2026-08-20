import { AlertTriangle, Wrench, Calendar, Shield, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRecentAlerts } from '@/hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';

const typeIcons: Record<string, any> = {
  'Panne': AlertTriangle,
  'Entretien': Wrench,
  'Réservation': Calendar,
  'Assurance': Shield,
  'Contrôle': Clock,
};

const priorityColors: Record<string, string> = {
  'urgent': 'bg-destructive/10 text-destructive border-destructive/20 animate-alert-pulse',
  'warning': 'bg-warning/10 text-warning border-warning/20',
  'info': 'bg-info/10 text-info border-info/20',
};

const priorityLabels: Record<string, string> = {
  'urgent': 'status.urgent',
  'warning': 'status.warning',
  'info': 'status.info',
};

const RecentAlerts = () => {
  const { data: alerts = [], isLoading } = useRecentAlerts();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = usePreferences();

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-card h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{t('dashboard.recentAlerts.title')}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary"
          onClick={() => navigate('/alerts')}
        >
          {t('dashboard.recentAlerts.viewAll')}
        </Button>
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('dashboard.recentAlerts.noData')}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any, index: number) => {
            const Icon = typeIcons[alert.type] || AlertTriangle;
            const priority = alert.priority || 'info';
            
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3 transition-all duration-200 hover:shadow-soft cursor-pointer animate-fade-in-up opacity-0',
                  priorityColors[priority]
                )}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    priority === 'urgent' && 'bg-destructive/20',
                    priority === 'warning' && 'bg-warning/20',
                    priority === 'info' && 'bg-info/20'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{alert.type}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-1.5 py-0',
                        priority === 'urgent' && 'border-destructive text-destructive',
                        priority === 'warning' && 'border-warning text-warning',
                        priority === 'info' && 'border-info text-info'
                      )}
                    >
                      {t(priorityLabels[priority])}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80 truncate">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {alert.vehicles && (
                      <>
                        <span className="text-xs font-medium">{alert.vehicles.registration}</span>
                        <span className="text-xs opacity-60">•</span>
                      </>
                    )}
                    <span className="text-xs opacity-60">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true, locale: getDateLocale() })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
