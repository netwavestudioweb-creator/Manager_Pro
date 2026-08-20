import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { formatCurrencyValue } from './utils';

// Company Name dynamically from localStorage
const getCompanyName = () => {
  return localStorage.getItem('fleet_company_name') || 'NOM DE LA SOCIÉTÉ (À Personnaliser)';
};

const formatCurrency = (amount: number) => {
  return formatCurrencyValue(amount);
};

const addHeader = (doc: jsPDF, title: string) => {
  // Company Name
  const companyName = getCompanyName();
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Primary blue
  doc.text(companyName, 20, 20);
  
  // App Title / System
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Système FleetManager Pro', 20, 28);
  
  // Subtitle / Report Title
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(title, 20, 40);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Généré le ${format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}`, 20, 48);
  
  // Line separator
  doc.setDrawColor(200);
  doc.line(20, 52, 190, 52);
};

const addFooter = (doc: jsPDF, pageNumber: number) => {
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Page ${pageNumber}`, 105, 290, { align: 'center' });
  const companyName = getCompanyName();
  doc.text(`${companyName} - FleetManager Pro`, 105, 295, { align: 'center' });
};

// 1. VEHICLES
export const exportFleetStatusPDF = async () => {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('brand', { ascending: true });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'État de la Flotte');

  const stats = {
    total: vehicles?.length || 0,
    available: vehicles?.filter(v => v.status === 'Disponible').length || 0,
    inMission: vehicles?.filter(v => v.status === 'En mission').length || 0,
    inMaintenance: vehicles?.filter(v => v.status === 'En entretien').length || 0,
    broken: vehicles?.filter(v => v.status === 'En panne').length || 0,
  };

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total véhicules: ${stats.total}`, 20, 62);
  doc.text(`Disponibles: ${stats.available}`, 20, 69);
  doc.text(`En mission: ${stats.inMission}`, 80, 69);
  doc.text(`En entretien: ${stats.inMaintenance}`, 140, 69);
  doc.text(`En panne: ${stats.broken}`, 20, 76);

  autoTable(doc, {
    startY: 85,
    head: [['Véhicule', 'Immatriculation', 'Année', 'Kilométrage', 'Carburant', 'Statut']],
    body: vehicles?.map(v => [
      `${v.brand} ${v.model}`,
      v.registration,
      v.year.toString(),
      `${v.mileage.toLocaleString()} km`,
      v.fuel_type,
      v.status,
    ]) || [],
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('etat-flotte.pdf');
};

// 2. MAINTENANCE
export const exportMaintenanceReportPDF = async () => {
  const { data: maintenance, error } = await supabase
    .from('maintenance_logs')
    .select('*, vehicles(brand, model, registration)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'Rapport d\'Entretien');

  const totalCost = maintenance?.reduce((sum, m) => sum + Number(m.cost), 0) || 0;
  const completed = maintenance?.filter(m => m.status === 'Terminé').length || 0;
  const pending = maintenance?.filter(m => m.status !== 'Terminé').length || 0;

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total entretiens: ${maintenance?.length || 0}`, 20, 62);
  doc.text(`Terminés: ${completed}`, 20, 69);
  doc.text(`En attente/cours: ${pending}`, 80, 69);
  doc.text(`Coût total: ${formatCurrency(totalCost)}`, 140, 69);

  autoTable(doc, {
    startY: 85,
    head: [['Véhicule', 'Immatriculation', 'Type', 'Date prévue', 'Statut', 'Coût']],
    body: maintenance?.map(m => [
      m.vehicles ? `${m.vehicles.brand} ${m.vehicles.model}` : 'N/A',
      m.vehicles?.registration || '-',
      m.type,
      m.scheduled_date ? format(new Date(m.scheduled_date), 'dd/MM/yyyy') : '-',
      m.status,
      formatCurrency(Number(m.cost)),
    ]) || [],
    headStyles: { fillColor: [245, 158, 11] },
    alternateRowStyles: { fillColor: [255, 251, 235] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('rapport-entretien.pdf');
};

// 3. FUEL
export const exportFuelConsumptionPDF = async () => {
  const { data: fuelLogs, error } = await supabase
    .from('fuel_logs')
    .select('*, vehicles(brand, model, registration), drivers(phone)')
    .order('date', { ascending: false });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'Consommation Carburant');

  const totalLiters = fuelLogs?.reduce((sum, f) => sum + Number(f.liters), 0) || 0;
  const totalCost = fuelLogs?.reduce((sum, f) => sum + Number(f.cost), 0) || 0;

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total pleins: ${fuelLogs?.length || 0}`, 20, 62);
  doc.text(`Litres consommés: ${totalLiters.toFixed(1)} L`, 20, 69);
  doc.text(`Coût total: ${formatCurrency(totalCost)}`, 120, 69);

  autoTable(doc, {
    startY: 85,
    head: [['Date', 'Véhicule', 'Chauffeur', 'Litres', 'Kilométrage', 'Coût']],
    body: fuelLogs?.map(f => [
      format(new Date(f.date), 'dd/MM/yyyy'),
      f.vehicles ? `${f.vehicles.brand} ${f.vehicles.model}` : 'N/A',
      f.drivers?.phone || '-',
      `${Number(f.liters).toFixed(1)} L`,
      `${f.mileage.toLocaleString()} km`,
      formatCurrency(Number(f.cost)),
    ]) || [],
    headStyles: { fillColor: [34, 197, 94] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('consommation-carburant.pdf');
};

// 4. FINANCIAL
export const exportFinancialReportPDF = async () => {
  const [maintenanceRes, fuelRes, breakdownsRes] = await Promise.all([
    supabase.from('maintenance_logs').select('cost, type, status'),
    supabase.from('fuel_logs').select('cost'),
    supabase.from('incidents').select('repair_cost'),
  ]);

  const doc = new jsPDF();
  addHeader(doc, 'Rapport Financier (Dépenses)');

  const maintenanceCost = maintenanceRes.data?.reduce((sum, m) => sum + Number(m.cost), 0) || 0;
  const fuelCost = fuelRes.data?.reduce((sum, f) => sum + Number(f.cost), 0) || 0;
  const repairCost = breakdownsRes.data?.reduce((sum, b) => sum + Number(b.repair_cost || 0), 0) || 0;
  const totalCost = maintenanceCost + fuelCost + repairCost;

  doc.setFillColor(240, 249, 255);
  doc.roundedRect(20, 60, 80, 35, 3, 3, 'F');
  doc.roundedRect(110, 60, 80, 35, 3, 3, 'F');
  
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(20, 100, 80, 35, 3, 3, 'F');
  doc.roundedRect(110, 100, 80, 35, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Coût Entretiens', 25, 70);
  doc.text('Coût Carburant', 115, 70);
  doc.text('Coût Pannes', 25, 110);
  doc.text('TOTAL GÉNÉRAL', 115, 110);

  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text(formatCurrency(maintenanceCost), 25, 85);
  doc.text(formatCurrency(fuelCost), 115, 85);
  doc.setTextColor(239, 68, 68);
  doc.text(formatCurrency(repairCost), 25, 125);
  doc.setTextColor(16, 185, 129);
  doc.text(formatCurrency(totalCost), 115, 125);

  const maintenanceByType: Record<string, number> = {};
  maintenanceRes.data?.forEach(m => {
    maintenanceByType[m.type] = (maintenanceByType[m.type] || 0) + Number(m.cost);
  });

  autoTable(doc, {
    startY: 145,
    head: [['Type d\'entretien', 'Coût total']],
    body: Object.entries(maintenanceByType).map(([type, cost]) => [
      type,
      formatCurrency(cost as number),
    ]),
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });

  addFooter(doc, 1);
  doc.save('rapport-financier.pdf');
};

// 5. DRIVERS
export const exportDriversPDF = async () => {
  const { data: drivers, error } = await supabase
    .from('drivers')
    .select('*')
    .order('phone', { ascending: true });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'Liste des Chauffeurs');

  const active = drivers?.filter(d => d.status === 'Actif').length || 0;

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total chauffeurs: ${drivers?.length || 0}`, 20, 62);
  doc.text(`Actifs: ${active}`, 80, 62);

  autoTable(doc, {
    startY: 75,
    head: [['Nom / Contact', 'Permis', 'Expiration', 'Statut']],
    body: drivers?.map(d => [
      d.phone || '-',
      d.license_number || '-',
      d.license_expiry ? format(new Date(d.license_expiry), 'dd/MM/yyyy') : '-',
      d.status,
    ]) || [],
    headStyles: { fillColor: [139, 92, 246] }, // Violet
    alternateRowStyles: { fillColor: [245, 243, 255] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('liste-chauffeurs.pdf');
};

// 6. BREAKDOWNS (Incidents)
export const exportBreakdownsPDF = async () => {
  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('*, vehicles(brand, model, registration)')
    .order('reported_date', { ascending: false });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'Rapport des Pannes');

  const totalCost = incidents?.reduce((sum, i) => sum + Number(i.repair_cost || 0), 0) || 0;
  const unresolved = incidents?.filter(i => i.status !== 'Résolu').length || 0;

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total incidents: ${incidents?.length || 0}`, 20, 62);
  doc.text(`Non résolus: ${unresolved}`, 80, 62);
  doc.text(`Coût réparations: ${formatCurrency(totalCost)}`, 140, 62);

  autoTable(doc, {
    startY: 75,
    head: [['Véhicule', 'Description', 'Sévérité', 'Statut', 'Date', 'Coût Rép.']],
    body: incidents?.map(i => [
      i.vehicles ? `${i.vehicles.brand} ${i.vehicles.model}` : 'N/A',
      i.description.substring(0, 30) + '...',
      i.severity,
      i.status,
      i.reported_date ? format(new Date(i.reported_date), 'dd/MM/yyyy') : '-',
      i.repair_cost ? formatCurrency(Number(i.repair_cost)) : '-',
    ]) || [],
    headStyles: { fillColor: [239, 68, 68] }, // Red
    alternateRowStyles: { fillColor: [254, 242, 242] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('rapport-pannes.pdf');
};

// 7. RESERVATIONS (Assignments)
export const exportReservationsPDF = async () => {
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('*, vehicles(brand, model, registration), drivers(phone)')
    .order('start_date', { ascending: false });

  if (error) throw error;

  const doc = new jsPDF();
  addHeader(doc, 'Rapport des Réservations');

  const active = assignments?.filter(a => a.status === 'En cours' || a.status === 'Confirmée').length || 0;

  doc.setFontSize(11);
  doc.setTextColor(60);
  doc.text(`Total réservations: ${assignments?.length || 0}`, 20, 62);
  doc.text(`En cours / Confirmées: ${active}`, 80, 62);

  autoTable(doc, {
    startY: 75,
    head: [['Début', 'Fin', 'Véhicule', 'Chauffeur', 'Mission', 'Statut']],
    body: assignments?.map(a => [
      format(new Date(a.start_date), 'dd/MM/yyyy'),
      format(new Date(a.end_date), 'dd/MM/yyyy'),
      a.vehicles ? `${a.vehicles.brand} ${a.vehicles.model}` : 'N/A',
      a.drivers?.phone || '-',
      a.destination || a.purpose || '-',
      a.status,
    ]) || [],
    headStyles: { fillColor: [14, 165, 233] }, // Sky blue
    alternateRowStyles: { fillColor: [240, 249, 255] },
    styles: { fontSize: 9 },
  });

  addFooter(doc, 1);
  doc.save('rapport-reservations.pdf');
};
