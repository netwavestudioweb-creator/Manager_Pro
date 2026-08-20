import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EXCHANGE_RATES } from './utils';

const getCompanyName = () => {
  return localStorage.getItem('fleet_company_name') || 'NOM DE LA SOCIÉTÉ (À Personnaliser)';
};

const generateExcel = (data: any[], headers: string[], filename: string, title: string) => {
  const companyName = getCompanyName();
  // Add company name and title as the first rows
  const worksheetData = [
    [companyName],
    [`${title} - Généré le ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: fr })}`],
    [], // Empty row
    headers,
    ...data
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Basic styling for the header (make it bold if possible, but xlsx free version doesn't support complex styling easily)
  // We just set column widths
  const wscols = headers.map(h => ({ wch: Math.max(h.length, 15) }));
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportVehiclesExcel = async () => {
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
  ]) || [];

  generateExcel(rows, headers, 'vehicules', 'Liste des Véhicules');
};

export const exportMaintenanceExcel = async () => {
  const { data, error } = await supabase
    .from('maintenance_logs')
    .select('*, vehicles (brand, model, registration)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const currency = (localStorage.getItem('fleet_currency') || 'fcfa') as keyof typeof EXCHANGE_RATES;
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencyLabel = currency.toUpperCase();
  
  const headers = ['Véhicule', 'Immatriculation', 'Type', 'Description', 'Statut', 'Date', `Coût (${currencyLabel})`, 'Kilométrage'];
  const rows = data?.map(m => [
    m.vehicles ? `${m.vehicles.brand} ${m.vehicles.model}` : '',
    m.vehicles?.registration || '',
    m.type,
    m.description || '',
    m.status,
    m.scheduled_date ? format(new Date(m.scheduled_date), 'dd/MM/yyyy') : '',
    m.cost ? Math.round(m.cost * rate) : 0,
    m.mileage_at_service || ''
  ]) || [];

  generateExcel(rows, headers, 'entretiens', 'Historique des Entretiens');
};

export const exportFuelExcel = async () => {
  const { data, error } = await supabase
    .from('fuel_logs')
    .select('*, vehicles (brand, model, registration), drivers (phone)')
    .order('date', { ascending: false });

  if (error) throw error;

  const currency = (localStorage.getItem('fleet_currency') || 'fcfa') as keyof typeof EXCHANGE_RATES;
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencyLabel = currency.toUpperCase();
  
  const headers = ['Date', 'Véhicule', 'Immatriculation', 'Litres', `Coût (${currencyLabel})`, 'Kilométrage', 'Station', 'Chauffeur'];
  const rows = data?.map(f => [
    format(new Date(f.date), 'dd/MM/yyyy'),
    f.vehicles ? `${f.vehicles.brand} ${f.vehicles.model}` : '',
    f.vehicles?.registration || '',
    f.liters,
    f.cost ? Math.round(f.cost * rate) : 0,
    f.mileage,
    f.station || '',
    f.drivers?.phone || ''
  ]) || [];

  generateExcel(rows, headers, 'carburant', 'Historique Carburant');
};

export const exportExpensesExcel = async () => {
  const { data: maintenanceData, error: maintenanceError } = await supabase
    .from('maintenance_logs')
    .select('type, cost, scheduled_date')
    .order('scheduled_date', { ascending: false });

  if (maintenanceError) throw maintenanceError;

  const { data: fuelData, error: fuelError } = await supabase
    .from('fuel_logs')
    .select('date, cost, liters')
    .order('date', { ascending: false });

  if (fuelError) throw fuelError;

  const { data: breakdownData, error: breakdownError } = await supabase
    .from('incidents')
    .select('description, repair_cost, reported_date')
    .order('reported_date', { ascending: false });

  if (breakdownError) throw breakdownError;

  const currency = (localStorage.getItem('fleet_currency') || 'fcfa') as keyof typeof EXCHANGE_RATES;
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencyLabel = currency.toUpperCase();
  
  const headers = ['Type', 'Description', 'Date', `Coût (${currencyLabel})`];
  const rows: any[] = [];

  maintenanceData?.forEach(m => {
    rows.push(['Entretien', m.type, m.scheduled_date ? format(new Date(m.scheduled_date), 'dd/MM/yyyy') : '', m.cost ? Math.round(m.cost * rate) : 0]);
  });

  fuelData?.forEach(f => {
    rows.push(['Carburant', `${f.liters}L`, format(new Date(f.date), 'dd/MM/yyyy'), f.cost ? Math.round(f.cost * rate) : 0]);
  });

  breakdownData?.forEach(b => {
    if (b.repair_cost) {
      rows.push(['Panne', b.description, b.reported_date ? format(new Date(b.reported_date), 'dd/MM/yyyy') : '', Math.round(b.repair_cost * rate)]);
    }
  });

  generateExcel(rows, headers, 'depenses_financieres', 'Détail des Dépenses');
};

export const exportDriversExcel = async () => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('phone');

  if (error) throw error;

  const headers = ['Nom / Téléphone', 'Numéro Permis', 'Expiration Permis', 'Statut'];
  const rows = data?.map(d => [
    d.phone || '',
    d.license_number || '',
    d.license_expiry ? format(new Date(d.license_expiry), 'dd/MM/yyyy') : '',
    d.status
  ]) || [];

  generateExcel(rows, headers, 'chauffeurs', 'Liste des Chauffeurs');
};

export const exportBreakdownsExcel = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*, vehicles (brand, model, registration)')
    .order('reported_date', { ascending: false });

  if (error) throw error;

  const currency = (localStorage.getItem('fleet_currency') || 'fcfa') as keyof typeof EXCHANGE_RATES;
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencyLabel = currency.toUpperCase();
  
  const headers = ['Véhicule', 'Immatriculation', 'Description', 'Sévérité', 'Statut', 'Date signalement', `Coût Réparation (${currencyLabel})`];
  const rows = data?.map(i => [
    i.vehicles ? `${i.vehicles.brand} ${i.vehicles.model}` : '',
    i.vehicles?.registration || '',
    i.description || '',
    i.severity,
    i.status,
    i.reported_date ? format(new Date(i.reported_date), 'dd/MM/yyyy') : '',
    i.repair_cost ? Math.round(i.repair_cost * rate) : ''
  ]) || [];

  generateExcel(rows, headers, 'pannes', 'Historique des Pannes');
};

export const exportReservationsExcel = async () => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*, vehicles (brand, model, registration), drivers (phone)')
    .order('start_date', { ascending: false });

  if (error) throw error;

  const headers = ['Début', 'Fin', 'Véhicule', 'Immatriculation', 'Chauffeur', 'Mission/Destination', 'Statut'];
  const rows = data?.map(a => [
    format(new Date(a.start_date), 'dd/MM/yyyy'),
    format(new Date(a.end_date), 'dd/MM/yyyy'),
    a.vehicles ? `${a.vehicles.brand} ${a.vehicles.model}` : '',
    a.vehicles?.registration || '',
    a.drivers?.phone || '',
    a.destination || a.purpose || '',
    a.status
  ]) || [];

  generateExcel(rows, headers, 'reservations', 'Historique des Réservations');
};
