import { useState } from 'react';
import { Plus, Search, Calendar, Clock, User, Car, CheckCircle2, XCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useReservations, useCreateReservation, useUpdateReservation, useDeleteReservation, ReservationWithDetails } from '@/hooks/useReservations';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const statusConfig = {
  'En attente': {
    label: 'En attente',
    className: 'bg-warning/10 text-warning border-warning/20',
    icon: AlertCircle,
  },
  'Confirmée': {
    label: 'Confirmée',
    className: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle2,
  },
  'Annulée': {
    label: 'Annulée',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
  },
  'Terminée': {
    label: 'Terminée',
    className: 'bg-muted text-muted-foreground border-muted',
    icon: CheckCircle2,
  },
};

const Reservations = () => {
  const { t, i18n } = useTranslation();
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: reservations, isLoading } = useReservations();
  const { data: vehicles } = useVehicles();
  const { data: drivers } = useDrivers();
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();
  const { canEdit } = useAuth();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    start_date: '',
    end_date: '',
    purpose: '',
    destination: '',
    notes: '',
  });

  const availableVehicles = vehicles?.filter(v => v.status === 'Disponible') || [];

  const filteredReservations = reservations?.filter((reservation) => {
    const vehicleName = reservation.vehicles ? `${reservation.vehicles.brand} ${reservation.vehicles.model}` : '';
    const driverName = reservation.drivers?.full_name || '';
    const matchesSearch =
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const pendingCount = reservations?.filter((r) => r.status === 'En attente').length || 0;
  const confirmedCount = reservations?.filter((r) => r.status === 'Confirmée').length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReservation.mutateAsync({
      vehicle_id: formData.vehicle_id,
      driver_id: formData.driver_id || null,
      start_date: formData.start_date,
      end_date: formData.end_date,
      purpose: formData.purpose || null,
      destination: formData.destination || null,
      notes: formData.notes || null,
    });
    setIsDialogOpen(false);
    setFormData({
      vehicle_id: '',
      driver_id: '',
      start_date: '',
      end_date: '',
      purpose: '',
      destination: '',
      notes: '',
    });
  };

  const handleConfirm = async (reservation: ReservationWithDetails) => {
    await updateReservation.mutateAsync({
      id: reservation.id,
      status: 'Confirmée',
    });
  };

  const handleCancel = async (reservation: ReservationWithDetails) => {
    await updateReservation.mutateAsync({
      id: reservation.id,
      status: 'Annulée',
    });
  };

  const handleComplete = async (reservation: ReservationWithDetails) => {
    await updateReservation.mutateAsync({
      id: reservation.id,
      status: 'Terminée',
    });
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
          <h1 className="text-3xl font-bold text-foreground">{t('reservations.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('reservations.subtitle')}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t('reservations.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] md:max-w-[900px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{t('reservations.addTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('reservations.addDesc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">{t('reservations.form.vehicle')}</Label>
                      <Select
                        value={formData.vehicle_id}
                        onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('reservations.form.vehiclePlaceholder')} />
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
                      <Label htmlFor="driver">{t('reservations.form.driver')}</Label>
                      <Select
                        value={formData.driver_id}
                        onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('reservations.form.driverPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers?.filter(d => d.is_active).map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">{t('reservations.form.startDate')}</Label>
                        <Input
                          id="start_date"
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">{t('reservations.form.endDate')}</Label>
                        <Input
                          id="end_date"
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">{t('reservations.form.purpose')}</Label>
                      <Input
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder={t('reservations.form.purposePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">{t('reservations.form.destination')}</Label>
                      <Input
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder={t('reservations.form.destinationPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t('reservations.form.notes')}</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder={t('reservations.form.notesPlaceholder')}
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createReservation.isPending || !formData.vehicle_id || !formData.start_date || !formData.end_date}
                  >
                    {createReservation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in-up opacity-0 stagger-1">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{reservations?.length || 0}</p>
              <p className="text-sm text-muted-foreground">{t('reservations.stats.total')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">{t('reservations.stats.pending')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{confirmedCount}</p>
              <p className="text-sm text-muted-foreground">{t('reservations.stats.confirmed')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Car className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{availableVehicles.length}</p>
              <p className="text-sm text-muted-foreground">{t('reservations.stats.availableVehicles')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in-up opacity-0 stagger-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('reservations.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('reservations.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('reservations.allStatuses')}</SelectItem>
            <SelectItem value="En attente">{t('status.pending')}</SelectItem>
            <SelectItem value="Confirmée">{t('status.confirmed')}</SelectItem>
            <SelectItem value="Terminée">{t('status.completed')}</SelectItem>
            <SelectItem value="Annulée">{t('status.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('reservations.noData')}
          </div>
        ) : (
          filteredReservations.map((reservation, index) => {
            const StatusIcon = statusConfig[reservation.status]?.icon || AlertCircle;
            const vehicleName = reservation.vehicles ? `${reservation.vehicles.brand} ${reservation.vehicles.model}` : t('reservations.list.unknownVehicle');

            return (
              <div
                key={reservation.id}
                className="rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow animate-fade-in-up opacity-0"
                style={{ animationDelay: `${(index + 3) * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left side */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">{reservation.purpose || t('reservations.list.defaultPurpose')}</h3>
                        <Badge
                          variant="outline"
                          className={cn('font-medium', statusConfig[reservation.status]?.className)}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {reservation.status === 'En attente' ? t('status.pending') :
                           reservation.status === 'Confirmée' ? t('status.confirmed') :
                           reservation.status === 'Terminée' ? t('status.completed') :
                           reservation.status === 'Annulée' ? t('status.cancelled') : reservation.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Car className="h-4 w-4" />
                          <span>{vehicleName}</span>
                          <span className="font-mono">({reservation.vehicles?.registration})</span>
                        </div>
                        {reservation.drivers && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{reservation.drivers.full_name}</span>
                          </div>
                        )}
                        {reservation.destination && (
                          <span className="text-muted-foreground">→ {reservation.destination}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="text-muted-foreground">{t('reservations.list.start')}</p>
                        <p className="font-medium text-card-foreground">
                          {format(new Date(reservation.start_date), 'dd/MM/yyyy HH:mm', { locale: getDateLocale() })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">{t('reservations.list.end')}</p>
                        <p className="font-medium text-card-foreground">
                          {format(new Date(reservation.end_date), 'dd/MM/yyyy HH:mm', { locale: getDateLocale() })}
                        </p>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex gap-2 mt-2">
                        {reservation.status === 'En attente' && (
                          <>
                            <Button size="sm" className="gradient-success text-success-foreground" onClick={() => handleConfirm(reservation)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {t('reservations.list.confirm')}
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleCancel(reservation)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              {t('reservations.list.reject')}
                            </Button>
                          </>
                        )}
                        {reservation.status === 'Confirmée' && (
                          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => handleComplete(reservation)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t('reservations.list.complete')}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => deleteReservation.mutate(reservation.id)}
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

export default Reservations;
