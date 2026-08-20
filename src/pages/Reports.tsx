import { FileText, Download, Calendar, Car, Wrench, Fuel, DollarSign, Users, AlertTriangle, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { exportVehiclesExcel, exportMaintenanceExcel, exportFuelExcel, exportExpensesExcel, exportDriversExcel, exportBreakdownsExcel, exportReservationsExcel } from '@/lib/excelExports';
import { exportFleetStatusPDF, exportMaintenanceReportPDF, exportFuelConsumptionPDF, exportFinancialReportPDF, exportDriversPDF, exportBreakdownsPDF, exportReservationsPDF } from '@/lib/pdfExports';
import { useVehicles } from '@/hooks/useVehicles';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useFuelLogs } from '@/hooks/useFuelLogs';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '@/contexts/PreferencesContext';

interface Report {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'pdf' | 'excel';
  category: 'vehicles' | 'maintenance' | 'fuel' | 'financial' | 'drivers' | 'breakdowns' | 'reservations';
  exportFn?: () => Promise<void>;
}

const categoryConfig: Record<string, { label: string; className: string }> = {
  vehicles: { label: 'Véhicules', className: 'bg-primary/10 text-primary' },
  maintenance: { label: 'Entretien', className: 'bg-warning/10 text-warning' },
  fuel: { label: 'Carburant', className: 'bg-success/10 text-success' },
  financial: { label: 'Financier', className: 'bg-info/10 text-info' },
  drivers: { label: 'Chauffeurs', className: 'bg-purple-500/10 text-purple-500' },
  breakdowns: { label: 'Pannes', className: 'bg-destructive/10 text-destructive' },
  reservations: { label: 'Réservations', className: 'bg-cyan-500/10 text-cyan-500' },
};

const Reports = () => {
  const { t } = useTranslation();
  const { formatMoney } = usePreferences();

  const [period, setPeriod] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'downloading' | 'success'>('downloading');
  const [downloadingReport, setDownloadingReport] = useState<Report | null>(null);
  
  const { toast } = useToast();
  
  const { data: vehicles = [] } = useVehicles();
  const { data: maintenance = [] } = useMaintenance();
  const { data: fuelLogs = [] } = useFuelLogs();

  const reports: Report[] = [
    { id: '1', title: t('reports.items.fleetStatus.title'), description: t('reports.items.fleetStatus.desc'), icon: Car, type: 'pdf', category: 'vehicles', exportFn: exportFleetStatusPDF },
    { id: '2', title: t('reports.items.vehiclesList.title'), description: t('reports.items.vehiclesList.desc'), icon: Car, type: 'excel', category: 'vehicles', exportFn: exportVehiclesExcel },
    
    { id: '3', title: t('reports.items.maintenanceReport.title'), description: t('reports.items.maintenanceReport.desc'), icon: Wrench, type: 'pdf', category: 'maintenance', exportFn: exportMaintenanceReportPDF },
    { id: '4', title: t('reports.items.maintenanceData.title'), description: t('reports.items.maintenanceData.desc'), icon: Wrench, type: 'excel', category: 'maintenance', exportFn: exportMaintenanceExcel },
    
    { id: '5', title: t('reports.items.fuelConsumption.title'), description: t('reports.items.fuelConsumption.desc'), icon: Fuel, type: 'pdf', category: 'fuel', exportFn: exportFuelConsumptionPDF },
    { id: '6', title: t('reports.items.fuelLogs.title'), description: t('reports.items.fuelLogs.desc'), icon: Fuel, type: 'excel', category: 'fuel', exportFn: exportFuelExcel },
    
    { id: '7', title: t('reports.items.financialReport.title'), description: t('reports.items.financialReport.desc'), icon: DollarSign, type: 'pdf', category: 'financial', exportFn: exportFinancialReportPDF },
    { id: '8', title: t('reports.items.financialData.title'), description: t('reports.items.financialData.desc'), icon: DollarSign, type: 'excel', category: 'financial', exportFn: exportExpensesExcel },
    
    { id: '9', title: t('reports.items.driversList.title'), description: t('reports.items.driversList.desc'), icon: Users, type: 'pdf', category: 'drivers', exportFn: exportDriversPDF },
    { id: '10', title: t('reports.items.driversData.title'), description: t('reports.items.driversData.desc'), icon: Users, type: 'excel', category: 'drivers', exportFn: exportDriversExcel },
    
    { id: '11', title: t('reports.items.breakdownsReport.title'), description: t('reports.items.breakdownsReport.desc'), icon: AlertTriangle, type: 'pdf', category: 'breakdowns', exportFn: exportBreakdownsPDF },
    { id: '12', title: t('reports.items.breakdownsData.title'), description: t('reports.items.breakdownsData.desc'), icon: AlertTriangle, type: 'excel', category: 'breakdowns', exportFn: exportBreakdownsExcel },
    
    { id: '13', title: t('reports.items.reservationsReport.title'), description: t('reports.items.reservationsReport.desc'), icon: Briefcase, type: 'pdf', category: 'reservations', exportFn: exportReservationsPDF },
    { id: '14', title: t('reports.items.reservationsData.title'), description: t('reports.items.reservationsData.desc'), icon: Briefcase, type: 'excel', category: 'reservations', exportFn: exportReservationsExcel },
  ];

  const filteredReports = reports.filter(
    (report) => categoryFilter === 'all' || report.category === categoryFilter
  );

  const handleExport = async (report: Report) => {
    if (!report.exportFn) {
      toast({
        title: t('common.error'),
        description: t('reports.downloading.notAvailable'),
        variant: 'destructive',
      });
      return;
    }

    setDownloadingReport(report);
    setDownloadStatus('downloading');
    setDownloadModalOpen(true);
    
    try {
      // Small artificial delay to show the nice car animation
      await new Promise(r => setTimeout(r, 1500));
      
      await report.exportFn();
      
      setDownloadStatus('success');
      
      // Auto close after success
      setTimeout(() => {
        setDownloadModalOpen(false);
      }, 1200);
      
    } catch (error) {
      console.error(error);
      setDownloadModalOpen(false);
      toast({
        title: t('reports.downloading.errorTitle'),
        description: t('reports.downloading.errorDesc'),
        variant: 'destructive',
      });
    }
  };

  const totalVehicles = vehicles.length;
  const totalMaintenance = maintenance.length;
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + Number(f.liters), 0);
  const totalCosts = maintenance.reduce((sum, m) => sum + Number(m.cost), 0) + 
                     fuelLogs.reduce((sum, f) => sum + Number(f.cost), 0);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-foreground">{t('reports.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('reports.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 animate-fade-in-up opacity-0 stagger-1">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t('reports.period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t('reports.periods.week')}</SelectItem>
            <SelectItem value="month">{t('reports.periods.month')}</SelectItem>
            <SelectItem value="quarter">{t('reports.periods.quarter')}</SelectItem>
            <SelectItem value="year">{t('reports.periods.year')}</SelectItem>
            <SelectItem value="all">{t('reports.periods.all')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('reports.category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('reports.categories.all')}</SelectItem>
            <SelectItem value="vehicles">{t('reports.categories.vehicles')}</SelectItem>
            <SelectItem value="maintenance">{t('reports.categories.maintenance')}</SelectItem>
            <SelectItem value="fuel">{t('reports.categories.fuel')}</SelectItem>
            <SelectItem value="financial">{t('reports.categories.financial')}</SelectItem>
            <SelectItem value="drivers">{t('reports.categories.drivers')}</SelectItem>
            <SelectItem value="breakdowns">{t('reports.categories.breakdowns')}</SelectItem>
            <SelectItem value="reservations">{t('reports.categories.reservations')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report, index) => {
          const Icon = report.icon;
          const config = categoryConfig[report.category];

          return (
            <div
              key={report.id}
              className="group rounded-2xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow animate-fade-in-up opacity-0 flex flex-col justify-between"
              style={{ animationDelay: `${(index % 10) * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      config.className
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-card-foreground leading-tight">{report.title}</h3>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shrink-0',
                          report.type === 'pdf'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-green-500/10 text-green-600'
                        )}
                      >
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 pl-14">{report.description}</p>
              </div>
              <div className="pl-14">
                <Button
                  variant={report.type === 'pdf' ? 'outline' : 'secondary'}
                  size="sm"
                  className={cn(
                    "w-full transition-all",
                    report.type === 'excel' && "hover:bg-green-500 hover:text-white"
                  )}
                  onClick={() => handleExport(report)}
                  disabled={downloadModalOpen && downloadingReport?.id === report.id}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {report.type === 'pdf' ? t('reports.generatePdf') : t('reports.generateExcel')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card animate-fade-in-up opacity-0 stagger-6 mt-8">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {t('reports.stats.title', { period: t(`reports.periods.${period}`) })}
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">{t('reports.stats.activeVehicles')}</p>
            <p className="text-2xl font-bold text-card-foreground">{totalVehicles}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">{t('reports.stats.maintenancesDone')}</p>
            <p className="text-2xl font-bold text-card-foreground">{totalMaintenance}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">{t('reports.stats.fuelConsumed')}</p>
            <p className="text-2xl font-bold text-card-foreground">{totalFuelLiters.toFixed(0)} L</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">{t('reports.stats.totalCosts')}</p>
            <p className="text-2xl font-bold text-primary">{formatMoney(totalCosts)}</p>
          </div>
        </div>
      </div>

      {/* Download Progress Modal */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-md border-primary/20 shadow-glow">
          <DialogTitle className="sr-only">Téléchargement en cours</DialogTitle>
          <div className="p-6 text-center space-y-6">
            {downloadStatus === 'downloading' ? (
              <>
                <div className="relative h-20 w-full overflow-hidden rounded-xl bg-muted/30 border border-border">
                  {/* The Road */}
                  <div className="absolute bottom-0 w-full h-2 bg-muted-foreground/20" />
                  
                  {/* The Car animating across */}
                  <div className="absolute bottom-2 animate-drive" style={{ width: '40px' }}>
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-card-foreground">
                    {t('reports.downloading.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {downloadingReport?.title}.{downloadingReport?.type === 'excel' ? 'xlsx' : 'pdf'}
                  </p>
                  <p className="text-xs text-primary animate-pulse font-medium mt-2">
                    {t('reports.downloading.subtitle')}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-4 animate-fade-in-up">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{t('reports.downloading.successTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('reports.downloading.successDesc', { file: downloadingReport?.title })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
