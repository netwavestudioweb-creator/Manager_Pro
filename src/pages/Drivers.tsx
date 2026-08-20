import { useState } from 'react';
import { Plus, Search, User, Phone, Mail, MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useDrivers, useCreateDriver, useUpdateDriver, useDeleteDriver, Driver } from '@/hooks/useDrivers';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const Drivers = () => {
  const { t, i18n } = useTranslation();
  
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return fr;
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const { data: drivers, isLoading } = useDrivers();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();
  const { canEdit } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expiry: '',
  });

  const filteredDrivers = drivers?.filter(
    (driver) =>
      driver.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const activeCount = drivers?.filter((d) => d.is_active).length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      await updateDriver.mutateAsync({
        id: editingDriver.id,
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        license_number: formData.license_number || null,
        license_expiry: formData.license_expiry || null,
      });
    } else {
      await createDriver.mutateAsync({
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        license_number: formData.license_number || null,
        license_expiry: formData.license_expiry || null,
      });
    }
    setIsDialogOpen(false);
    setEditingDriver(null);
    setFormData({ full_name: '', email: '', phone: '', license_number: '', license_expiry: '' });
  };

  const openEditDialog = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      full_name: driver.full_name,
      email: driver.email || '',
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      license_expiry: driver.license_expiry || '',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingDriver(null);
    setFormData({ full_name: '', email: '', phone: '', license_number: '', license_expiry: '' });
    setIsDialogOpen(true);
  };

  const isLicenseExpiringSoon = (expiry: string | null) => {
    if (!expiry) return false;
    const expiryDate = new Date(expiry);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
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
          <h1 className="text-3xl font-bold text-foreground">{t('drivers.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('drivers.subtitle')}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t('drivers.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] md:max-w-[800px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingDriver ? t('drivers.editTitle') : t('drivers.addTitle')}</DialogTitle>
                  <DialogDescription>
                    {editingDriver ? t('drivers.editDesc') : t('drivers.addDesc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">{t('drivers.form.fullName')}</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder={t('drivers.form.fullNamePlaceholder')}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('drivers.form.email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('drivers.form.emailPlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('drivers.form.phone')}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t('drivers.form.phonePlaceholder')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license_number">{t('drivers.form.licenseNumber')}</Label>
                        <Input
                          id="license_number"
                          value={formData.license_number}
                          onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                          placeholder={t('drivers.form.licenseNumberPlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_expiry">{t('drivers.form.licenseExpiry')}</Label>
                        <Input
                          id="license_expiry"
                          type="date"
                          value={formData.license_expiry}
                          onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={createDriver.isPending || updateDriver.isPending || !formData.full_name}>
                    {(createDriver.isPending || updateDriver.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingDriver ? t('common.save') : t('drivers.add')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up opacity-0 stagger-1">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{drivers?.length || 0}</p>
              <p className="text-sm text-muted-foreground">{t('drivers.stats.total')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <User className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{activeCount}</p>
              <p className="text-sm text-muted-foreground">{t('drivers.stats.active')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <User className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {drivers?.filter(d => isLicenseExpiringSoon(d.license_expiry)).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">{t('drivers.stats.expiring')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md animate-fade-in-up opacity-0 stagger-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('drivers.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t('drivers.noData')}
          </div>
        ) : (
          filteredDrivers.map((driver, index) => (
            <div
              key={driver.id}
              className="group rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow hover:scale-[1.02] animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(index + 3) * 50}ms`, animationFillMode: 'forwards' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={driver.photo_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {driver.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{driver.full_name}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        'mt-1 font-medium',
                        driver.is_active 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-muted text-muted-foreground border-muted'
                      )}
                    >
                      {driver.is_active ? t('drivers.list.active') : t('drivers.list.inactive')}
                    </Badge>
                  </div>
                </div>
                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(driver)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteDriver.mutate(driver.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm mb-4">
                {driver.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                )}
                {driver.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{driver.phone}</span>
                  </div>
                )}
              </div>

              {/* License Info */}
              {(driver.license_number || driver.license_expiry) && (
                <div className={cn(
                  'rounded-xl p-3 mb-4',
                  isLicenseExpiringSoon(driver.license_expiry) ? 'bg-warning/10 border border-warning/20' : 'bg-muted/50'
                )}>
                  {driver.license_number && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('drivers.list.licenseNumber')}</span>
                      <span className="font-mono text-card-foreground">{driver.license_number}</span>
                    </div>
                  )}
                  {driver.license_expiry && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">{t('drivers.list.expiry')}</span>
                      <span className={cn(
                        "text-card-foreground",
                        isLicenseExpiringSoon(driver.license_expiry) && "text-warning font-medium"
                      )}>
                        {format(new Date(driver.license_expiry), 'dd/MM/yyyy', { locale: getDateLocale() })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Drivers;
