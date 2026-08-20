import { useState } from 'react';
import { Plus, Search, Fuel as FuelIcon, TrendingUp, TrendingDown, Car, Calendar, Coins, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatNumber } from '@/lib/utils';
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFuelLogs, useCreateFuelLog, useDeleteFuelLog } from '@/hooks/useFuelLogs';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import { useAuth } from '@/contexts/AuthContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const Fuel = () => {
  const { t, i18n } = useTranslation();
  const { formatMoney } = usePreferences();
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: fuelLogs, isLoading } = useFuelLogs();
  const { data: vehicles } = useVehicles();
  const { data: drivers } = useDrivers();
  const createFuelLog = useCreateFuelLog();
  const deleteFuelLog = useDeleteFuelLog();
  const { canEdit } = useAuth();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    liters: '',
    cost: '',
    mileage: '',
    station: '',
    fuel_type: 'Diesel',
  });

  const filteredLogs = fuelLogs?.filter(
    (log) => {
      const vehicleName = log.vehicles ? `${log.vehicles.brand} ${log.vehicles.model}` : '';
      return vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.vehicles?.registration.toLowerCase().includes(searchQuery.toLowerCase());
    }
  ) || [];

  // Calculate stats
  const totalLiters = fuelLogs?.reduce((acc, log) => acc + Number(log.liters), 0) || 0;
  const totalCost = fuelLogs?.reduce((acc, log) => acc + Number(log.cost), 0) || 0;

  // Calculate consumption trends for chart
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const monthLogs = fuelLogs?.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= start && logDate <= end;
      }) || [];

      const totalLiters = monthLogs.reduce((acc, log) => acc + Number(log.liters), 0);
      
      months.push({
        month: format(monthDate, 'MMM', { locale: getDateLocale() }),
        liters: totalLiters,
      });
    }
    return months;
  };

  const consumptionData = getMonthlyData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFuelLog.mutateAsync({
      vehicle_id: formData.vehicle_id,
      driver_id: formData.driver_id || null,
      liters: parseFloat(formData.liters),
      cost: parseFloat(formData.cost),
      mileage: parseInt(formData.mileage),
      station: formData.station || null,
      fuel_type: formData.fuel_type,
    });
    setIsDialogOpen(false);
    setFormData({
      vehicle_id: '',
      driver_id: '',
      liters: '',
      cost: '',
      mileage: '',
      station: '',
      fuel_type: 'Diesel',
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
          <h1 className="text-3xl font-bold text-foreground">{t('fuel.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('fuel.subtitle')}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t('fuel.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{t('fuel.addTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('fuel.addDesc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">
                  {/* Left Column: General Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">{t('fuel.form.vehicle')}</Label>
                      <Select
                        value={formData.vehicle_id}
                        onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('fuel.form.vehiclePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles?.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.brand} {vehicle.model} ({vehicle.registration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver">{t('fuel.form.driver')}</Label>
                      <Select
                        value={formData.driver_id}
                        onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('fuel.form.driverPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers?.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="station">{t('fuel.form.station')}</Label>
                      <Input
                        id="station"
                        value={formData.station}
                        onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                        placeholder={t('fuel.form.stationPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Right Column: Transaction Details */}
                  <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="liters">{t('fuel.form.liters')}</Label>
                        <Input
                          id="liters"
                          type="number"
                          step="0.01"
                          value={formData.liters}
                          onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                          placeholder="45"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">{t('fuel.form.cost')}</Label>
                        <Input
                          id="cost"
                          type="number"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                          placeholder="50000"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mileage">{t('fuel.form.mileage')}</Label>
                        <Input
                          id="mileage"
                          type="number"
                          value={formData.mileage}
                          onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                          placeholder="45000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuel_type">{t('fuel.form.type')}</Label>
                        <Select
                          value={formData.fuel_type}
                          onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diesel">{t('fuel.form.types.diesel')}</SelectItem>
                            <SelectItem value="Essence">{t('fuel.form.types.gasoline')}</SelectItem>
                            <SelectItem value="Hybride">{t('fuel.form.types.hybrid')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createFuelLog.isPending || !formData.vehicle_id || !formData.liters || !formData.cost || !formData.mileage}
                  >
                    {createFuelLog.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              <FuelIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{formatNumber(totalLiters)} L</p>
              <p className="text-sm text-muted-foreground">{t('fuel.stats.totalConsumed')}</p>
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
              <p className="text-sm text-muted-foreground">{t('fuel.stats.totalCost')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <TrendingUp className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{fuelLogs?.length || 0}</p>
              <p className="text-sm text-muted-foreground">{t('fuel.stats.recordedLogs')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <Car className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {formatMoney(totalLiters > 0 && totalCost > 0 ? Math.round(totalCost / totalLiters) : 0)}
              </p>
              <p className="text-sm text-muted-foreground">{t('fuel.stats.avgCost')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-card p-6 shadow-card animate-fade-in-up opacity-0 stagger-2">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {t('fuel.chartTitle')}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consumptionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                tickFormatter={(value) => `${value} L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                formatter={(value: number) => [`${formatNumber(value)} L`, t('fuel.chartTooltip')]}
              />
              <Line
                type="monotone"
                dataKey="liters"
                stroke="hsl(221 83% 53%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(221 83% 53%)', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md animate-fade-in-up opacity-0 stagger-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('fuel.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Fuel Logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('fuel.noData')}
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const vehicleName = log.vehicles ? `${log.vehicles.brand} ${log.vehicles.model}` : t('fuel.list.unknownVehicle');
            
            return (
              <div
                key={log.id}
                className="rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow animate-fade-in-up opacity-0"
                style={{ animationDelay: `${(index + 4) * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left side */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                      <FuelIcon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">{vehicleName}</h3>
                        <span className="font-mono text-sm text-muted-foreground">{log.vehicles?.registration}</span>
                        {log.fuel_type && (
                          <Badge variant="outline" className="bg-muted">
                            {log.fuel_type}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(log.date), 'dd/MM/yyyy', { locale: getDateLocale() })}</span>
                        <span>•</span>
                        <span>{formatNumber(log.mileage)} km</span>
                        {log.station && (
                          <>
                            <span>•</span>
                            <span>{log.station}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">{t('fuel.list.liters')}</p>
                      <p className="text-xl font-bold text-card-foreground">{formatNumber(Number(log.liters))} L</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">{t('fuel.list.cost')}</p>
                      <p className="text-xl font-bold text-primary">{formatMoney(Number(log.cost))}</p>
                    </div>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => deleteFuelLog.mutate(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default Fuel;
