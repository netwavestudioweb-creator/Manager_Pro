import { useState } from 'react';
import { Plus, Search, Filter, Wrench, Calendar, Coins, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatNumber } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useMaintenance, useCreateMaintenance, MaintenanceWithVehicle } from '@/hooks/useMaintenance';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';
import type { MaintenanceStatus } from '@/services/api/types';

const statusConfig: Record<MaintenanceStatus, { label: string; icon: typeof Calendar; className: string }> = {
  'Prévu': {
    label: 'Prévu',
    icon: Calendar,
    className: 'bg-info/10 text-info border-info/20',
  },
  'En cours': {
    label: 'En cours',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  'Terminé': {
    label: 'Terminé',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success border-success/20',
  },
};

const Maintenance = () => {
  const { t } = useTranslation();
  const { formatMoney } = usePreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [cost, setCost] = useState('');
  const [mileageAtService, setMileageAtService] = useState('');
  const [nextServiceMileage, setNextServiceMileage] = useState('');

  const { data: maintenanceRecords = [], isLoading, error } = useMaintenance();
  const { data: vehicles = [] } = useVehicles();
  const createMaintenance = useCreateMaintenance();
  const { canEdit } = useAuth();

  const filteredRecords = maintenanceRecords.filter((record) => {
    const vehicleName = record.vehicles ? `${record.vehicles.brand} ${record.vehicles.model}` : '';
    const matchesSearch =
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vehicles?.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCost = maintenanceRecords.reduce((acc, record) => acc + Number(record.cost), 0);
  const scheduledCount = maintenanceRecords.filter((r) => r.status === 'Prévu').length;
  const inProgressCount = maintenanceRecords.filter((r) => r.status === 'En cours').length;

  const resetForm = () => {
    setVehicleId('');
    setType('');
    setDescription('');
    setScheduledDate('');
    setCost('');
    setMileageAtService('');
    setNextServiceMileage('');
  };

  const handleAdd = async () => {
    if (!vehicleId || !type) return;
    
    await createMaintenance.mutateAsync({
      vehicle_id: vehicleId,
      type,
      description: description || null,
      scheduled_date: scheduledDate || null,
      cost: parseFloat(cost) || 0,
      mileage_at_service: parseInt(mileageAtService) || null,
      next_service_mileage: parseInt(nextServiceMileage) || null,
    });
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        {t("maintenance.errorLoading")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('maintenance.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('maintenance.subtitle')}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t('maintenance.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{t('maintenance.addTitle')}</DialogTitle>
                <DialogDescription>
                  {t('maintenance.addDesc')}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">{t('maintenance.form.vehicle')}</Label>
                    <Select value={vehicleId} onValueChange={setVehicleId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('maintenance.form.vehiclePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.brand} {v.model} - {v.registration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">{t('maintenance.form.type')}</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('maintenance.form.typePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vidange">{t('maintenance.form.types.oilChange')}</SelectItem>
                          <SelectItem value="Freins">{t('maintenance.form.types.brakes')}</SelectItem>
                          <SelectItem value="Pneus">{t('maintenance.form.types.tires')}</SelectItem>
                          <SelectItem value="Révision complète">{t('maintenance.form.types.fullService')}</SelectItem>
                          <SelectItem value="Climatisation">{t('maintenance.form.types.ac')}</SelectItem>
                          <SelectItem value="Batterie">{t('maintenance.form.types.battery')}</SelectItem>
                          <SelectItem value="Courroie">{t('maintenance.form.types.belt')}</SelectItem>
                          <SelectItem value="Autre">{t('maintenance.form.types.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">{t('maintenance.form.date')}</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={scheduledDate} 
                        onChange={(e) => setScheduledDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('maintenance.form.description')}</Label>
                    <Textarea 
                      id="description" 
                      placeholder={t('maintenance.form.descriptionPlaceholder')} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost">{t('maintenance.form.cost')}</Label>
                      <Input 
                        id="cost" 
                        type="number" 
                        placeholder="0" 
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">{t('maintenance.form.mileage')}</Label>
                      <Input 
                        id="mileage" 
                        type="number" 
                        placeholder="0" 
                        value={mileageAtService}
                        onChange={(e) => setMileageAtService(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextMileage">{t('maintenance.form.nextMileage')}</Label>
                    <Input 
                      id="nextMileage" 
                      type="number" 
                      placeholder="0" 
                      value={nextServiceMileage}
                      onChange={(e) => setNextServiceMileage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="gradient-primary text-primary-foreground" 
                  onClick={handleAdd}
                  disabled={createMaintenance.isPending}
                >
                  {createMaintenance.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t('maintenance.add')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in-up opacity-0 stagger-1">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{maintenanceRecords.length}</p>
              <p className="text-sm text-muted-foreground">{t('maintenance.stats.total')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Calendar className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{scheduledCount}</p>
              <p className="text-sm text-muted-foreground">{t('maintenance.stats.scheduled')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{inProgressCount}</p>
              <p className="text-sm text-muted-foreground">{t('maintenance.stats.inProgress')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Coins className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{formatMoney(totalCost)}</p>
              <p className="text-sm text-muted-foreground">{t('maintenance.stats.totalCost')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in-up opacity-0 stagger-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('maintenance.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('maintenance.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('maintenance.allStatuses')}</SelectItem>
            <SelectItem value="Prévu">{t('status.planned')}</SelectItem>
            <SelectItem value="En cours">{t('status.inProgress')}</SelectItem>
            <SelectItem value="Terminé">{t('status.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty state */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('maintenance.noData')}</p>
        </div>
      )}

      {/* Maintenance List */}
      <div className="space-y-4">
        {filteredRecords.map((record, index) => {
          const StatusIcon = statusConfig[record.status]?.icon || Calendar;
          const currentMileage = record.mileage_at_service || 0;
          const nextMileage = record.next_service_mileage || currentMileage + 10000;
          const progress = nextMileage > 0 ? (currentMileage / nextMileage) * 100 : 0;

          return (
            <div
              key={record.id}
              className="rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(index + 3) * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left side */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                    <Wrench className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-card-foreground">{record.type}</h3>
                      <Badge
                        variant="outline"
                        className={cn('font-medium', statusConfig[record.status]?.className)}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {record.status === 'Prévu' ? t('status.planned') : 
                         record.status === 'En cours' ? t('status.inProgress') : 
                         record.status === 'Terminé' ? t('status.completed') : record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{record.description || t('maintenance.list.noDescription')}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-card-foreground font-medium">
                        {record.vehicles ? `${record.vehicles.brand} ${record.vehicles.model}` : t('maintenance.list.unknownVehicle')}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-mono text-muted-foreground">{record.vehicles?.registration}</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('maintenance.list.date')}</p>
                      <p className="font-medium text-card-foreground">{record.scheduled_date || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('maintenance.list.mileage')}</p>
                      <p className="font-medium text-card-foreground">
                        {record.mileage_at_service ? formatNumber(record.mileage_at_service) + ' km' : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('maintenance.list.cost')}</p>
                      <p className="font-semibold text-primary">{formatMoney(Number(record.cost))}</p>
                    </div>
                  </div>
                  {record.next_service_mileage && (
                    <div className="w-full lg:w-48">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{t('maintenance.list.next')} {formatNumber(record.next_service_mileage)} km</span>
                        <span>{Math.min(Math.round(progress), 100)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Maintenance;
