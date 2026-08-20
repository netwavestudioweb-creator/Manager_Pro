import { useState } from 'react';
import { Plus, Search, Filter, Car, MoreVertical, Eye, Edit, Trash2, AlertTriangle, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, formatNumber } from '@/lib/utils';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle, Vehicle } from '@/hooks/useVehicles';
import { useAuth } from '@/contexts/AuthContext';
import type { VehicleStatus } from '@/services/api/types';
import { useTranslation } from 'react-i18next';

const statusConfig: Record<VehicleStatus, { label: string; className: string }> = {
  'Disponible': { label: 'Disponible', className: 'bg-success/10 text-success border-success/20' },
  'En mission': { label: 'En mission', className: 'bg-primary/10 text-primary border-primary/20' },
  'En entretien': { label: 'Entretien', className: 'bg-warning/10 text-warning border-warning/20' },
  'En panne': { label: 'En panne', className: 'bg-destructive/10 text-destructive border-destructive/20 animate-alert-pulse' },
};

const Vehicles = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [registration, setRegistration] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [category, setCategory] = useState('');
  const [mileage, setMileage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUrl2, setPhotoUrl2] = useState('');
  const [photoUrl3, setPhotoUrl3] = useState('');

  const { data: vehicles = [], isLoading, error } = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const { canEdit } = useAuth();

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setBrand('');
    setModel('');
    setYear('');
    setRegistration('');
    setFuelType('Diesel');
    setCategory('');
    setMileage('');
    setPhotoUrl('');
    setPhotoUrl2('');
    setPhotoUrl3('');
  };

  const handleAdd = async () => {
    if (!brand || !model || !year || !registration) return;
    
    await createVehicle.mutateAsync({
      brand,
      model,
      year: parseInt(year),
      registration,
      fuel_type: fuelType,
      category: category || null,
      mileage: parseInt(mileage) || 0,
      photo_url: photoUrl || null,
      photo_url_2: photoUrl2 || null,
      photo_url_3: photoUrl3 || null,
    });
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year.toString());
    setRegistration(vehicle.registration);
    setFuelType(vehicle.fuel_type);
    setCategory(vehicle.category || '');
    setMileage(vehicle.mileage.toString());
    setPhotoUrl(vehicle.photo_url || '');
    setPhotoUrl2(vehicle.photo_url_2 || '');
    setPhotoUrl3(vehicle.photo_url_3 || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedVehicle || !brand || !model || !year || !registration) return;
    
    await updateVehicle.mutateAsync({
      id: selectedVehicle.id,
      brand,
      model,
      year: parseInt(year),
      registration,
      fuel_type: fuelType,
      category: category || null,
      mileage: parseInt(mileage) || 0,
      photo_url: photoUrl || null,
      photo_url_2: photoUrl2 || null,
      photo_url_3: photoUrl3 || null,
    });
    
    resetForm();
    setSelectedVehicle(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;
    await deleteVehicle.mutateAsync(selectedVehicle.id);
    setSelectedVehicle(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
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
        Erreur lors du chargement des véhicules
      </div>
    );
  }

  const VehicleForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 max-h-[75vh] overflow-y-auto px-2">
      {/* Colonne de gauche: Infos du véhicule & Photo Principale */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">{t('vehicles.form.brand')}</Label>
            <Input id="brand" placeholder={t('vehicles.form.brandPlaceholder')} value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">{t('vehicles.form.model')}</Label>
            <Input id="model" placeholder={t('vehicles.form.modelPlaceholder')} value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">{t('vehicles.form.year')}</Label>
            <Input id="year" type="number" placeholder={t('vehicles.form.yearPlaceholder')} value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">{t('vehicles.form.registration')}</Label>
            <Input id="plate" placeholder={t('vehicles.form.registrationPlaceholder')} value={registration} onChange={(e) => setRegistration(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuel">{t('vehicles.form.fuel')}</Label>
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Essence">Essence</SelectItem>
                <SelectItem value="Hybride">Hybride</SelectItem>
                <SelectItem value="Électrique">Électrique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t('vehicles.form.category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Citadine">Citadine</SelectItem>
                <SelectItem value="Compacte">Compacte</SelectItem>
                <SelectItem value="Berline">Berline</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Utilitaire">Utilitaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">{t('vehicles.form.mileage')}</Label>
          <Input id="mileage" type="number" placeholder="0" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>
        
        {/* Photo 1 (Principale) sous les informations */}
        <div className="pt-4 mt-4 border-t border-border/50">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-4">
            <ImageIcon className="h-4 w-4 text-primary" /> {t('vehicles.form.photo1') || "Photo principale"}
          </h4>
          <ImageUpload label={t('vehicles.form.photo1')} value={photoUrl} onChange={setPhotoUrl} className="w-full" />
        </div>
      </div>
      
      {/* Colonne de droite: Photos Additionnelles */}
      <div className="space-y-4 md:border-l md:pl-6 md:border-border/50">
        <h4 className="text-sm font-medium flex items-center gap-2 mb-4">
          <ImageIcon className="h-4 w-4 text-primary" /> Photos additionnelles (Optionnel)
        </h4>
        <div className="flex flex-col space-y-8 mt-2">
          <ImageUpload label={t('vehicles.form.photo2')} value={photoUrl2} onChange={setPhotoUrl2} className="w-full" />
          <ImageUpload label={t('vehicles.form.photo3')} value={photoUrl3} onChange={setPhotoUrl3} className="w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('vehicles.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('vehicles.subtitle', { count: vehicles.length })}
          </p>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-all w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {t('vehicles.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{t('vehicles.addTitle')}</DialogTitle>
                <DialogDescription>
                  {t('vehicles.addDesc')}
                </DialogDescription>
              </DialogHeader>
              <VehicleForm />
              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }} className="w-full sm:w-auto">
                  {t('common.cancel')}
                </Button>
                <Button 
                  className="gradient-primary text-primary-foreground w-full sm:w-auto" 
                  onClick={handleAdd}
                  disabled={createVehicle.isPending}
                >
                  {createVehicle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t('vehicles.add')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center animate-fade-in-up opacity-0 stagger-1">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('vehicles.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('vehicles.filterStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vehicles.allStatuses')}</SelectItem>
              <SelectItem value="Disponible">{t('status.available')}</SelectItem>
              <SelectItem value="En mission">{t('status.onMission')}</SelectItem>
              <SelectItem value="En entretien">{t('status.inMaintenance')}</SelectItem>
              <SelectItem value="En panne">{t('status.brokenDown')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty state */}
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('vehicles.noData')}</p>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className={cn(
              'group rounded-2xl bg-card p-4 sm:p-5 shadow-card transition-all duration-300 hover:shadow-glow hover:scale-[1.02] animate-fade-in-up opacity-0',
              vehicle.status === 'En panne' && 'ring-2 ring-destructive/30'
            )}
            style={{ animationDelay: `${(index + 2) * 50}ms`, animationFillMode: 'forwards' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                {vehicle.photo_url ? (
                  <div className="h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl border border-border shadow-sm shrink-0">
                    <img 
                      src={vehicle.photo_url} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl gradient-primary shrink-0">
                    <Car className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-card-foreground truncate">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                </div>
              </div>
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('vehicles.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(vehicle)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('vehicles.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Status Badge */}
            <Badge
              variant="outline"
              className={cn('mb-4 font-medium', statusConfig[vehicle.status]?.className)}
            >
              {vehicle.status === 'Disponible' ? t('status.available') : 
               vehicle.status === 'En mission' ? t('status.onMission') : 
               vehicle.status === 'En entretien' ? t('status.inMaintenance') : 
               vehicle.status === 'En panne' ? t('status.brokenDown') : vehicle.status}
            </Badge>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('vehicles.plate')}</span>
                <span className="font-mono font-medium text-card-foreground truncate ml-2">{vehicle.registration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('vehicles.fuel')}</span>
                <span className="text-card-foreground">{vehicle.fuel_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('vehicles.mileage')}</span>
                <span className="font-medium text-card-foreground">
                  {formatNumber(vehicle.mileage)} km
                </span>
              </div>
              {vehicle.category && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('vehicles.category')}</span>
                  <span className="text-card-foreground truncate ml-2">{vehicle.category}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { resetForm(); setSelectedVehicle(null); } }}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[900px] w-[95vw] rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('vehicles.editTitle')}</DialogTitle>
            <DialogDescription>
              {t('vehicles.editDesc')}
            </DialogDescription>
          </DialogHeader>
          <VehicleForm />
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); setSelectedVehicle(null); }} className="w-full sm:w-auto">
              {t('common.cancel')}
            </Button>
            <Button 
              className="gradient-primary text-primary-foreground w-full sm:w-auto" 
              onClick={handleUpdate}
              disabled={updateVehicle.isPending}
            >
              {updateVehicle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('vehicles.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('vehicles.deleteDesc', { brand: selectedVehicle?.brand, model: selectedVehicle?.model })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              {deleteVehicle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t('vehicles.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehicles;
