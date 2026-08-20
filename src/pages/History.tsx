import { useState } from 'react';
import { Search, Filter, Car, Wrench, AlertTriangle, Calendar, Fuel, User, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHistory, HistoryEvent } from '@/hooks/useHistory';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { getDateLocale } from '@/i18n';

const History = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: events = [], isLoading } = useHistory();

  const typeConfig = {
    maintenance: {
      icon: Wrench,
      label: t('history.types.maintenance'),
      className: 'bg-warning/10 text-warning border-warning/20',
      iconBg: 'bg-warning/20',
    },
    breakdown: {
      icon: AlertTriangle,
      label: t('history.types.breakdown'),
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      iconBg: 'bg-destructive/20',
    },
    reservation: {
      icon: Calendar,
      label: t('history.types.reservation'),
      className: 'bg-primary/10 text-primary border-primary/20',
      iconBg: 'bg-primary/20',
    },
    fuel: {
      icon: Fuel,
      label: t('history.types.fuel'),
      className: 'bg-success/10 text-success border-success/20',
      iconBg: 'bg-success/20',
    },
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group events by date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = format(event.rawDate, 'dd MMMM yyyy', { locale: getDateLocale() });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, HistoryEvent[]>);

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
        <h1 className="text-3xl font-bold text-foreground">{t('history.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('history.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in-up opacity-0 stagger-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('history.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('history.filterType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('history.allTypes')}</SelectItem>
            <SelectItem value="maintenance">{t('history.types.maintenance')}</SelectItem>
            <SelectItem value="breakdown">{t('history.types.breakdown')}</SelectItem>
            <SelectItem value="reservation">{t('history.types.reservation')}</SelectItem>
            <SelectItem value="fuel">{t('history.types.fuel')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {Object.keys(groupedEvents).length === 0 && (
        <div className="rounded-2xl bg-card p-8 text-center shadow-card animate-fade-in-up">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground">{t('history.noDataTitle')}</h3>
          <p className="text-muted-foreground">
            {searchQuery || typeFilter !== 'all' 
              ? t('history.noDataFilter')
              : t('history.noDataDesc')}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([date, dateEvents], groupIndex) => (
          <div key={date} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${(groupIndex + 2) * 100}ms`, animationFillMode: 'forwards' }}>
            {/* Date Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4">
              <h2 className="text-lg font-semibold text-foreground">{date}</h2>
            </div>

            {/* Events */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-4">
                {dateEvents.map((event, index) => {
                  const config = typeConfig[event.type];
                  const TypeIcon = config.icon;

                  return (
                    <div
                      key={event.id}
                      className="relative pl-14 animate-slide-in-left opacity-0"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                    >
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          'absolute left-2.5 w-5 h-5 rounded-full flex items-center justify-center',
                          config.iconBg
                        )}
                      >
                        <TypeIcon className={cn('h-3 w-3', config.className.split(' ')[1])} />
                      </div>

                      {/* Event Card */}
                      <div className="rounded-2xl bg-card p-4 shadow-card transition-all duration-300 hover:shadow-glow">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-card-foreground">{event.title}</h3>
                              <Badge variant="outline" className={config.className}>
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Car className="h-4 w-4" />
                                <span>{event.vehicle}</span>
                                {event.plate && (
                                  <span className="font-mono">({event.plate})</span>
                                )}
                              </div>
                              {event.user !== 'Système' && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>{event.user}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground lg:text-right">
                            <Clock className="h-4 w-4" />
                            <span>{format(event.rawDate, 'HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
