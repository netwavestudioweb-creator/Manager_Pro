import { useState } from 'react';
import { Bell, AlertTriangle, Wrench, Calendar, Shield, Clock, CheckCircle2, Filter, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAlerts, useMarkAlertAsRead, useMarkAllAlertsAsRead, useDeleteAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const typeConfig: Record<string, { icon: typeof AlertTriangle; label: string; color: string }> = {
  breakdown: { icon: AlertTriangle, label: 'Panne', color: 'text-destructive' },
  maintenance: { icon: Wrench, label: 'Entretien', color: 'text-warning' },
  reservation: { icon: Calendar, label: 'Réservation', color: 'text-info' },
  insurance: { icon: Shield, label: 'Assurance', color: 'text-primary' },
  inspection: { icon: Clock, label: 'Contrôle', color: 'text-muted-foreground' },
};

const priorityConfig = {
  urgent: {
    label: 'Urgent',
    className: 'bg-destructive/10 text-destructive border-destructive/20 animate-alert-pulse',
    bgClassName: 'bg-destructive/5 border-destructive/20',
  },
  warning: {
    label: 'Attention',
    className: 'bg-warning/10 text-warning border-warning/20',
    bgClassName: 'bg-warning/5 border-warning/20',
  },
  info: {
    label: 'Info',
    className: 'bg-info/10 text-info border-info/20',
    bgClassName: 'bg-info/5 border-info/20',
  },
};

const Alerts = () => {
  const { t, i18n } = useTranslation();
  
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };

  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: alerts = [], isLoading } = useAlerts();
  const markAsRead = useMarkAlertAsRead();
  const markAllAsRead = useMarkAllAlertsAsRead();
  const deleteAlert = useDeleteAlert();
  const { canEdit } = useAuth();

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    return matchesPriority && matchesType;
  });

  const unreadCount = alerts.filter((a) => !a.is_read).length;
  const urgentCount = alerts.filter((a) => a.priority === 'urgent' && !a.is_read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return t('alerts.timeAgo.minutes', { count: diffInMinutes });
    } else if (diffInMinutes < 1440) {
      return t('alerts.timeAgo.hours', { count: Math.floor(diffInMinutes / 60) });
    } else {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: getDateLocale() });
    }
  };

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('alerts.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('alerts.subtitle')}
          </p>
        </div>
        {canEdit && unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            {markAllAsRead.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {t('alerts.markAllRead')}
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up opacity-0 stagger-1">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{alerts.length}</p>
              <p className="text-sm text-muted-foreground">{t('alerts.stats.total')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Bell className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">{t('alerts.stats.unread')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 animate-alert-pulse">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{urgentCount}</p>
              <p className="text-sm text-muted-foreground">{t('alerts.stats.urgent')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 animate-fade-in-up opacity-0 stagger-2">
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('alerts.filters.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('alerts.filters.allPriorities')}</SelectItem>
            <SelectItem value="urgent">{t('alerts.priorities.urgent')}</SelectItem>
            <SelectItem value="warning">{t('alerts.priorities.warning')}</SelectItem>
            <SelectItem value="info">{t('alerts.priorities.info')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('alerts.filters.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('alerts.filters.allTypes')}</SelectItem>
            <SelectItem value="breakdown">{t('alerts.types.breakdown')}</SelectItem>
            <SelectItem value="maintenance">{t('alerts.types.maintenance')}</SelectItem>
            <SelectItem value="reservation">{t('alerts.types.reservation')}</SelectItem>
            <SelectItem value="insurance">{t('alerts.types.insurance')}</SelectItem>
            <SelectItem value="inspection">{t('alerts.types.inspection')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-card">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground">{t('alerts.noDataTitle')}</h3>
            <p className="text-muted-foreground">{t('alerts.noDataDesc')}</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => {
            const typeInfo = typeConfig[alert.type] || typeConfig.maintenance;
            const TypeIcon = typeInfo.icon;
            const priority = priorityConfig[alert.priority] || priorityConfig.info;

            return (
              <div
                key={alert.id}
                className={cn(
                  'rounded-2xl border p-4 transition-all duration-300 hover:shadow-glow cursor-pointer animate-fade-in-up opacity-0',
                  alert.is_read ? 'bg-card' : priority.bgClassName,
                  !alert.is_read && 'shadow-card'
                )}
                style={{ animationDelay: `${(index + 3) * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      alert.priority === 'urgent' && 'bg-destructive/20',
                      alert.priority === 'warning' && 'bg-warning/20',
                      alert.priority === 'info' && 'bg-info/20'
                    )}
                  >
                    <TypeIcon className={cn('h-5 w-5', typeInfo.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {!alert.is_read && alert.priority === 'urgent' ? (
                        <div className="flex items-center gap-1 text-destructive animate-pulse bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{t('alerts.actionRequired')}</span>
                        </div>
                      ) : !alert.is_read ? (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      ) : null}
                      <h3 className={cn('font-semibold', alert.is_read ? 'text-muted-foreground' : 'text-card-foreground')}>
                        {alert.message}
                      </h3>
                      <Badge variant="outline" className={priority.className}>
                        {t(`alerts.priorities.${alert.priority}`) || priority.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t(`alerts.types.${alert.type}`) || typeInfo.label}
                      </Badge>
                    </div>
                    {alert.vehicles && (
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-medium text-card-foreground">
                          {alert.vehicles.brand} {alert.vehicles.model}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-mono text-muted-foreground">{alert.vehicles.registration}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{formatDate(alert.created_at)}</span>
                      </div>
                    )}
                    {!alert.vehicles && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(alert.created_at)}
                      </p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      {!alert.is_read && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead.mutate(alert.id);
                          }}
                          disabled={markAsRead.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAlert.mutate(alert.id);
                        }}
                        disabled={deleteAlert.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
