import { supabase } from '@/integrations/supabase/client';
import { formatShortDate } from './utils';

// Helper to get current currency
const getCurrency = () => {
  try {
    const currency = localStorage.getItem('fleet_currency');
    if (currency) {
      return currency.toUpperCase();
    }
  } catch (e) {
    // ignore
  }
  return 'FCFA';
};

// CSV Export helper
const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export vehicles to CSV
export const exportVehiclesCSV = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('brand');

  if (error) throw error;

  const headers = ['Marque', 'Modèle', 'Année', 'Immatriculation', 'Statut', 'Carburant', 'Kilométrage', 'Catégorie'];
  const rows = data?.map(v => [
    v.brand,
    v.model,
    v.year,
    v.registration,
    v.status,
    v.fuel_type,
    v.mileage,
    v.category || ''
  ]);

  const csv = [headers.join(';'), ...(rows?.map(r => r.join(';')) || [])].join('\n');
  downloadCSV(csv, `vehicules_${formatShortDate(new Date())}.csv`);
};

// Export maintenance to CSV
export const exportMaintenanceCSV = async () => {
  const { data, error } = await supabase
    .from('maintenance')
    .select(`
      *,
      vehicles (brand, model, registration)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const headers = ['Véhicule', 'Immatriculation', 'Type', 'Description', 'Statut', 'Date', `Coût (${getCurrency()})`, 'Kilométrage'];
  const rows = data?.map(m => [
    m.vehicles ? `${m.vehicles.brand} ${m.vehicles.model}` : '',
    m.vehicles?.registration || '',
    m.type,
    m.description || '',
    m.status,
    m.scheduled_date || '',
    m.cost,
    m.mileage_at_service || ''
  ]);

  const csv = [headers.join(';'), ...(rows?.map(r => r.join(';')) || [])].join('\n');
  downloadCSV(csv, `entretiens_${formatShortDate(new Date())}.csv`);
};

// Export fuel logs to CSV
export const exportFuelCSV = async () => {
  const { data, error } = await supabase
    .from('fuel_logs')
    .select(`
      *,
      vehicles (brand, model, registration),
      drivers (full_name)
    `)
    .order('date', { ascending: false });

  if (error) throw error;

  const headers = ['Date', 'Véhicule', 'Immatriculation', 'Litres', `Coût (${getCurrency()})`, 'Kilométrage', 'Station', 'Chauffeur'];
  const rows = data?.map(f => [
    f.date,
    f.vehicles ? `${f.vehicles.brand} ${f.vehicles.model}` : '',
    f.vehicles?.registration || '',
    f.liters,
    f.cost,
    f.mileage,
    f.station || '',
    f.drivers?.full_name || ''
  ]);

  const csv = [headers.join(';'), ...(rows?.map(r => r.join(';')) || [])].join('\n');
  downloadCSV(csv, `carburant_${formatShortDate(new Date())}.csv`);
};

// Export expenses summary to CSV
export const exportExpensesCSV = async () => {
  // Fetch maintenance costs
  const { data: maintenanceData, error: maintenanceError } = await supabase
    .from('maintenance')
    .select('type, cost, scheduled_date')
    .order('scheduled_date', { ascending: false });

  if (maintenanceError) throw maintenanceError;

  // Fetch fuel costs
  const { data: fuelData, error: fuelError } = await supabase
    .from('fuel_logs')
    .select('date, cost, liters')
    .order('date', { ascending: false });

  if (fuelError) throw fuelError;

  // Fetch breakdown costs
  const { data: breakdownData, error: breakdownError } = await supabase
    .from('breakdowns')
    .select('description, repair_cost, reported_date')
    .order('reported_date', { ascending: false });

  if (breakdownError) throw breakdownError;

  const headers = ['Type', 'Description', 'Date', `Coût (${getCurrency()})`];
  const rows: string[][] = [];

  maintenanceData?.forEach(m => {
    rows.push(['Entretien', m.type, m.scheduled_date || '', String(m.cost)]);
  });

  fuelData?.forEach(f => {
    rows.push(['Carburant', `${f.liters}L`, f.date, String(f.cost)]);
  });

  breakdownData?.forEach(b => {
    if (b.repair_cost) {
      rows.push(['Panne', b.description, b.reported_date, String(b.repair_cost)]);
    }
  });

  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  downloadCSV(csv, `depenses_${formatShortDate(new Date())}.csv`);
};

// Simple PDF export using browser print
export const exportToPDF = (title: string, content: HTMLElement) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .date { color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p class="date">Généré le ${formatShortDate(new Date())}</p>
        </div>
        ${content.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};
