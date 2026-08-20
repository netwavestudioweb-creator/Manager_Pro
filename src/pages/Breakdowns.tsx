import { useState } from 'react';
import { Plus, Search, AlertTriangle, CheckCircle2, Clock, Car, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
import { useBreakdowns, useCreateBreakdown, useUpdateBreakdown, useDeleteBreakdown, BreakdownWithVehicle } from '@/hooks/useBreakdowns';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const severityConfig: Record<string, { labelKey: string; className: string; icon: any }> = {
  Faible: {
    labelKey: "breakdowns.form.severityLow",
    className: 'bg-info/10 text-info border-info/20',
    icon: AlertTriangle,
  },
  Moyenne: {
    labelKey: "breakdowns.form.severityMedium",
    className: 'bg-warning/10 text-warning border-warning/20',
    icon: AlertTriangle,
  },
  Haute: {
    labelKey: "breakdowns.form.severityHigh",
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: AlertTriangle,
  },
  Critique: {
    labelKey: "breakdowns.form.severityCritical",
    className: 'bg-destructive/10 text-destructive border-destructive/20 animate-alert-pulse',
    icon: AlertTriangle,
  },
};

const statusConfig: Record<string, { labelKey: string; className: string; icon: any }> = {
  Ouverte: {
    labelKey: "breakdowns.status.open",
    className: 'bg-destructive text-destructive-foreground',
    icon: Clock,
  },
  'Résolue': {
    labelKey: "breakdowns.status.resolved",
    className: 'bg-success text-success-foreground',
    icon: CheckCircle2,
  },
};

const Breakdowns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<BreakdownWithVehicle | null>(null);

  const { data: breakdowns, isLoading } = useBreakdowns();
  const { data: vehicles } = useVehicles();
  const createBreakdown = useCreateBreakdown();
  const updateBreakdown = useUpdateBreakdown();
  const deleteBreakdown = useDeleteBreakdown();
  const { canEdit } = useAuth();
  const { t, i18n } = useTranslation();
  const { currency, formatMoney } = usePreferences();

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };

  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
    severity: 'Moyenne' as 'Faible' | 'Moyenne' | 'Haute' | 'Critique',
  });

  const [resolveData, setResolveData] = useState({
    resolution_notes: '',
    repair_cost: '',
  });

  const availableVehicles = vehicles?.filter(v => v.status !== 'En panne') || [];

  const filteredBreakdowns = breakdowns?.filter((breakdown) => {
    const vehicleName = breakdown.vehicles ? `${breakdown.vehicles.brand} ${breakdown.vehicles.model}` : '';
    const matchesSearch =
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakdown.vehicles?.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakdown.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || breakdown.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const openCount = breakdowns?.filter((b) => b.status === 'Ouverte').length || 0;
  const criticalCount = breakdowns?.filter((b) => (b.severity === 'Haute' || b.severity === 'Critique') && b.status === 'Ouverte').length || 0;
  const resolvedCount = breakdowns?.filter((b) => b.status === 'Résolue').length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBreakdown.mutateAsync({
      vehicle_id: formData.vehicle_id,
      description: formData.description,
      severity: formData.severity,
    });
    setIsDialogOpen(false);
    setFormData({ vehicle_id: '', description: '', severity: 'Moyenne' });
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBreakdown) return;
    
    await updateBreakdown.mutateAsync({
      id: selectedBreakdown.id,
      status: 'Résolue',
      resolved_date: new Date().toISOString().split('T')[0],
      resolution_notes: resolveData.resolution_notes || null,
      repair_cost: resolveData.repair_cost ? parseFloat(resolveData.repair_cost) : null,
    });
    setIsResolveDialogOpen(false);
    setSelectedBreakdown(null);
    setResolveData({ resolution_notes: '', repair_cost: '' });
  };

  const openResolveDialog = (breakdown: BreakdownWithVehicle) => {
    setSelectedBreakdown(breakdown);
    setIsResolveDialogOpen(true);
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
          <h1 className="text-3xl font-bold text-foreground">{t("breakdowns.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("breakdowns.subtitle")}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-danger text-destructive-foreground shadow-soft hover:shadow-glow transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t("breakdowns.form.declareAction")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{t("breakdowns.form.declareTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("breakdowns.form.declareSubtitle")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">{t("breakdowns.form.vehicle")} *</Label>
                      <Select
                        value={formData.vehicle_id}
                        onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("breakdowns.form.vehiclePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.brand} {vehicle.model} ({vehicle.registration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity">{t("breakdowns.form.severity")} *</Label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Faible">{t("breakdowns.form.severityLow")}</SelectItem>
                          <SelectItem value="Moyenne">{t("breakdowns.form.severityMedium")}</SelectItem>
                          <SelectItem value="Haute">{t("breakdowns.form.severityHigh")}</SelectItem>
                          <SelectItem value="Critique">{t("breakdowns.form.severityCritical")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                    <div className="space-y-2 h-full flex flex-col">
                      <Label htmlFor="description">{t("breakdowns.form.description")} *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={t("breakdowns.form.descriptionPlaceholder")}
                        className="flex-1 min-h-[120px]"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t("breakdowns.cancel")}
                  </Button>
                  <Button type="submit" disabled={createBreakdown.isPending || !formData.vehicle_id || !formData.description}>
                    {createBreakdown.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t("breakdowns.form.declareAction")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
          <form onSubmit={handleResolve}>
            <DialogHeader>
              <DialogTitle>{t("breakdowns.resolveTitle")}</DialogTitle>
              <DialogDescription>
                {selectedBreakdown?.vehicles && `${selectedBreakdown.vehicles.brand} ${selectedBreakdown.vehicles.model}`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repair_cost">{t("breakdowns.form.repairCost")} ({currency.toUpperCase()})</Label>
                  <Input
                    id="repair_cost"
                    type="number"
                    value={resolveData.repair_cost}
                    onChange={(e) => setResolveData({ ...resolveData, repair_cost: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                <div className="space-y-2 h-full flex flex-col">
                  <Label htmlFor="resolution_notes">{t("breakdowns.form.resolutionNotes")}</Label>
                  <Textarea
                    id="resolution_notes"
                    value={resolveData.resolution_notes}
                    onChange={(e) => setResolveData({ ...resolveData, resolution_notes: e.target.value })}
                    placeholder={t("breakdowns.form.resolutionNotesPlaceholder")}
                    className="flex-1 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                {t("breakdowns.cancel")}
              </Button>
              <Button type="submit" className="gradient-success" disabled={updateBreakdown.isPending}>
                {updateBreakdown.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                {t("breakdowns.form.resolveAction")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 animate-fade-in-up opacity-0 stagger-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 animate-alert-pulse">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-destructive">
                {criticalCount} {t("breakdowns.list.criticalCount")}
              </p>
              <p className="text-sm text-destructive/80">
                {t("breakdowns.list.immediateAction")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up opacity-0 stagger-2">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{openCount}</p>
              <p className="text-sm text-muted-foreground">{t("breakdowns.stats.open")}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">{t("breakdowns.form.severityCritical")}s</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{resolvedCount}</p>
              <p className="text-sm text-muted-foreground">{t("breakdowns.status.resolved")}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in-up opacity-0 stagger-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("breakdowns.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("maintenance.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("maintenance.allStatuses")}</SelectItem>
            <SelectItem value="Ouverte">{t("breakdowns.status.open")}</SelectItem>
            <SelectItem value="Résolue">{t("breakdowns.status.resolved")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Breakdowns List */}
      <div className="space-y-4">
        {filteredBreakdowns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("breakdowns.noData")}
          </div>
        ) : (
          filteredBreakdowns.map((breakdown, index) => {
            const SeverityIcon = severityConfig[breakdown.severity].icon;
            const StatusIcon = statusConfig[breakdown.status].icon;
            const vehicleName = breakdown.vehicles ? `${breakdown.vehicles.brand} ${breakdown.vehicles.model}` : t("breakdowns.list.unknownVehicle");

            return (
              <div
                key={breakdown.id}
                className={cn(
                  'rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow animate-fade-in-up opacity-0',
                  breakdown.status === 'Ouverte' && (breakdown.severity === 'Haute' || breakdown.severity === 'Critique') && 'ring-2 ring-destructive/30'
                )}
                style={{ animationDelay: `${(index + 4) * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left side */}
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        breakdown.status === 'Ouverte' ? 'gradient-danger' : 'bg-muted'
                      )}
                    >
                      <Car
                        className={cn(
                          'h-6 w-6',
                          breakdown.status === 'Ouverte' ? 'text-destructive-foreground' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-card-foreground">{vehicleName}</h3>
                        <span className="font-mono text-sm text-muted-foreground">{breakdown.vehicles?.registration}</span>
                        <Badge
                          variant="outline"
                          className={cn('font-medium', severityConfig[breakdown.severity].className)}
                        >
                          <SeverityIcon className="mr-1 h-3 w-3" />
                          {t(severityConfig[breakdown.severity].labelKey)}
                        </Badge>
                        <Badge className={statusConfig[breakdown.status].className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {t(statusConfig[breakdown.status].labelKey)}
                        </Badge>
                      </div>
                      <p className="text-card-foreground">{breakdown.description}</p>
                      {breakdown.resolution_notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">{t("breakdowns.list.resolution")}:</span> {breakdown.resolution_notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col gap-2 lg:items-end text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("breakdowns.list.reportedOn")}</p>
                      <p className="font-medium text-card-foreground">
                        {format(new Date(breakdown.reported_date), 'dd/MM/yyyy', { locale: getDateLocale() })}
                      </p>
                    </div>
                    {breakdown.resolved_date && (
                      <div>
                        <p className="text-muted-foreground">{t("breakdowns.list.resolvedOn")}</p>
                        <p className="font-medium text-success">
                          {format(new Date(breakdown.resolved_date), 'dd/MM/yyyy', { locale: getDateLocale() })}
                        </p>
                      </div>
                    )}
                    {breakdown.repair_cost && (
                      <div>
                        <p className="text-muted-foreground">{t("breakdowns.list.cost")}</p>
                        <p className="font-medium text-primary">{formatMoney(breakdown.repair_cost)}</p>
                      </div>
                    )}
                    {canEdit && (
                      <div className="flex gap-2 mt-2">
                        {breakdown.status === 'Ouverte' && (
                          <Button size="sm" className="gradient-success text-success-foreground" onClick={() => openResolveDialog(breakdown)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t("breakdowns.form.resolveAction")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => deleteBreakdown.mutate(breakdown.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Breakdowns;
