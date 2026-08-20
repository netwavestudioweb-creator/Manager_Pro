/**
 * Supabase Adapter Implementation
 * This is the concrete implementation of the DatabaseAdapter interface.
 * All Supabase-specific logic is contained here.
 */

import { supabase } from '@/integrations/supabase/client';
import { formatCurrencyValue } from '@/lib/utils';
import type { DatabaseAdapter } from '../api/adapter';
import type {
  AppRole,
  SignInCredentials,
  SignUpCredentials,
  VehicleCreate,
  VehicleUpdate,
  DriverCreate,
  DriverUpdate,
  MaintenanceCreate,
  MaintenanceUpdate,
  BreakdownCreate,
  BreakdownUpdate,
  ReservationCreate,
  ReservationUpdate,
  FuelLogCreate,
  AlertUpdate,
  DashboardStats,
  VehicleStatusChartData,
  HistoryEvent,
  UserSession,
  Profile,
} from '../api/types';
import {
  mapVehicleFromDb,
  mapVehicleToDb,
  mapDriverFromDb,
  mapDriverToDb,
  mapMaintenanceFromDb,
  mapMaintenanceToDb,
  mapBreakdownFromDb,
  mapBreakdownToDb,
  mapReservationFromDb,
  mapReservationToDb,
  mapFuelLogFromDb,
  mapFuelLogToDb,
  mapAlertFromDb,
  mapProfileFromDb,
  mapSessionFromSupabase,
} from './mappers';

/**
 * Supabase implementation of the DatabaseAdapter
 */
export const supabaseAdapter: DatabaseAdapter = {
  // ============ AUTH ============
  auth: {
    async getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      return mapSessionFromSupabase(session);
    },

    onAuthStateChange(callback: (session: UserSession | null) => void) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          callback(mapSessionFromSupabase(session));
        }
      );
      return () => subscription.unsubscribe();
    },

    async signIn(credentials: SignInCredentials) {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      return { error };
    },

    async signUp(credentials: SignUpCredentials) {
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: credentials.fullName },
        },
      });
      return { error };
    },

    async signOut() {
      await supabase.auth.signOut();
    },

    async updatePassword(newPassword: string) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    },

    async getUserRole(userId: string): Promise<AppRole | null> {
      const { data, error } = await supabase
        .from('users')
        .select('roles(name)')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role:', error);
        return null;
      }
      return (data?.roles as any)?.name as AppRole || null;
    },

    async getProfile(userId: string): Promise<Profile | null> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data ? mapProfileFromDb(data) : null;
    },

    async updateProfile(userId: string, data: Partial<Profile>) {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
        })
        .eq('id', userId);

      return { error };
    },
  },

  // ============ VEHICLES ============
  vehicles: {
    async getAll() {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapVehicleFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapVehicleFromDb(data) : null;
    },

    async create(vehicleData: VehicleCreate) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(mapVehicleToDb(vehicleData))
        .select()
        .single();

      if (error) throw error;
      return mapVehicleFromDb(data);
    },

    async update({ id, ...vehicleData }: VehicleUpdate) {
      const { data, error } = await supabase
        .from('vehicles')
        .update(mapVehicleToDb(vehicleData as VehicleCreate))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapVehicleFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ DRIVERS ============
  drivers: {
    async getAll() {
      const { data, error } = await supabase
        .from('drivers')
        .select('*');

      if (error) throw error;
      return (data || []).map(mapDriverFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapDriverFromDb(data) : null;
    },

    async create(driverData: DriverCreate) {
      const { data, error } = await supabase
        .from('drivers')
        .insert(mapDriverToDb(driverData))
        .select()
        .single();

      if (error) throw error;
      return mapDriverFromDb(data);
    },

    async update({ id, ...driverData }: DriverUpdate) {
      const { data, error } = await supabase
        .from('drivers')
        .update(mapDriverToDb(driverData as DriverCreate))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDriverFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('drivers').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ MAINTENANCE ============
  maintenance: {
    async getAll() {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select(`*, vehicles (brand, model, registration)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapMaintenanceFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select(`*, vehicles (brand, model, registration)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapMaintenanceFromDb(data) : null;
    },

    async create(maintenanceData: MaintenanceCreate) {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .insert(mapMaintenanceToDb(maintenanceData))
        .select()
        .single();

      if (error) throw error;
      return mapMaintenanceFromDb(data);
    },

    async update({ id, ...maintenanceData }: MaintenanceUpdate) {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .update(mapMaintenanceToDb(maintenanceData as MaintenanceCreate))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapMaintenanceFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('maintenance_logs').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ BREAKDOWNS (Incidents) ============
  breakdowns: {
    async getAll() {
      const { data, error } = await supabase
        .from('incidents')
        .select(`*, vehicles (brand, model, registration)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapBreakdownFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('incidents')
        .select(`*, vehicles (brand, model, registration)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapBreakdownFromDb(data) : null;
    },

    async create(breakdownData: BreakdownCreate) {
      const { data, error } = await supabase
        .from('incidents')
        .insert(mapBreakdownToDb(breakdownData))
        .select()
        .single();

      if (error) throw error;
      return mapBreakdownFromDb(data);
    },

    async update({ id, ...breakdownData }: BreakdownUpdate) {
      const { data, error } = await supabase
        .from('incidents')
        .update(mapBreakdownToDb(breakdownData as BreakdownCreate))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapBreakdownFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('incidents').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ RESERVATIONS (Assignments) ============
  reservations: {
    async getAll() {
      const { data, error } = await supabase
        .from('assignments')
        .select(`*, vehicles (brand, model, registration), drivers (phone)`)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapReservationFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('assignments')
        .select(`*, vehicles (brand, model, registration), drivers (phone)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapReservationFromDb(data) : null;
    },

    async create(reservationData: ReservationCreate) {
      const { data, error } = await supabase
        .from('assignments')
        .insert(mapReservationToDb(reservationData))
        .select()
        .single();

      if (error) throw error;
      return mapReservationFromDb(data);
    },

    async update({ id, ...reservationData }: ReservationUpdate) {
      const { data, error } = await supabase
        .from('assignments')
        .update(mapReservationToDb(reservationData as ReservationCreate))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapReservationFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ FUEL LOGS ============
  fuelLogs: {
    async getAll() {
      const { data, error } = await supabase
        .from('fuel_logs')
        .select(`*, vehicles (brand, model, registration), drivers (phone)`)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapFuelLogFromDb);
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('fuel_logs')
        .select(`*, vehicles (brand, model, registration), drivers (phone)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapFuelLogFromDb(data) : null;
    },

    async create(fuelLogData: FuelLogCreate) {
      const { data, error } = await supabase
        .from('fuel_logs')
        .insert(mapFuelLogToDb(fuelLogData))
        .select()
        .single();

      if (error) throw error;
      return mapFuelLogFromDb(data);
    },

    async delete(id: string) {
      const { error } = await supabase.from('fuel_logs').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ ALERTS (System Alerts) ============
  alerts: {
    async getAll() {
      const { data, error } = await supabase
        .from('system_alerts')
        .select(`*, vehicles (brand, model, registration)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapAlertFromDb);
    },

    async getRecent(limit = 5) {
      const { data, error } = await supabase
        .from('system_alerts')
        .select(`*, vehicles (brand, model, registration)`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(mapAlertFromDb);
    },

    async update({ id, ...alertData }: AlertUpdate) {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({
          is_read: alertData.is_read,
          message: alertData.message,
          priority: alertData.priority,
          type: alertData.type,
          due_date: alertData.due_date,
          vehicle_id: alertData.vehicle_id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapAlertFromDb(data);
    },

    async markAsRead(id: string) {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapAlertFromDb(data);
    },

    async markAllAsRead() {
      const { error } = await supabase
        .from('system_alerts')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
    },

    async delete(id: string) {
      const { error } = await supabase.from('system_alerts').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // ============ DASHBOARD ============
  dashboard: {
    async getStats(): Promise<DashboardStats> {
      // Fetch vehicles stats
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('status');

      if (vehiclesError) throw vehiclesError;

      const totalVehicles = vehicles?.length || 0;
      const inMaintenance = vehicles?.filter(v => v.status === 'En entretien').length || 0;
      const breakdowns = vehicles?.filter(v => v.status === 'En panne').length || 0;
      const available = vehicles?.filter(v => v.status === 'Disponible').length || 0;
      const inMission = vehicles?.filter(v => v.status === 'En mission').length || 0;
      const availabilityRate = totalVehicles > 0
        ? Math.round(((available + inMission) / totalVehicles) * 100)
        : 0;

      // Fetch active assignments
      const { count: assignmentsCount, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .in('status', ['En cours', 'Confirmée', 'En attente']);

      if (assignmentsError) throw assignmentsError;

      // Fetch fuel consumption this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: fuelData, error: fuelError } = await supabase
        .from('fuel_logs')
        .select('liters')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (fuelError) throw fuelError;

      const monthlyFuel = fuelData?.reduce((sum, log) => sum + Number(log.liters), 0) || 0;

      // Fetch active drivers
      const { count: driversCount, error: driversError } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Actif');

      if (driversError) throw driversError;

      // Fetch maintenance costs this month
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_logs')
        .select('cost')
        .gte('created_at', startOfMonth.toISOString());

      if (maintenanceError) throw maintenanceError;

      const maintenanceCosts = maintenanceData?.reduce((sum, m) => sum + Number(m.cost), 0) || 0;

      // Fetch fuel costs this month
      const { data: fuelCostData, error: fuelCostError } = await supabase
        .from('fuel_logs')
        .select('cost')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (fuelCostError) throw fuelCostError;

      const monthlyFuelCosts = fuelCostData?.reduce((sum, f) => sum + Number(f.cost), 0) || 0;

      return {
        totalVehicles,
        inMaintenance,
        breakdowns,
        available,
        inMission,
        availabilityRate,
        activeReservations: assignmentsCount || 0,
        monthlyFuel: Math.round(monthlyFuel),
        activeDrivers: driversCount || 0,
        monthlyCosts: maintenanceCosts + monthlyFuelCosts,
      };
    },

    async getVehicleStatusChart(): Promise<VehicleStatusChartData[]> {
      const { data, error } = await supabase.from('vehicles').select('status');

      if (error) throw error;

      const statusCounts = {
        'Disponible': 0,
        'En mission': 0,
        'En entretien': 0,
        'En panne': 0,
      };

      data?.forEach(v => {
        if (v.status && v.status in statusCounts) {
          statusCounts[v.status as keyof typeof statusCounts]++;
        }
      });

      return [
        { name: 'Disponible', value: statusCounts['Disponible'], fill: 'hsl(142 76% 36%)' },
        { name: 'En mission', value: statusCounts['En mission'], fill: 'hsl(221 83% 53%)' },
        { name: 'En entretien', value: statusCounts['En entretien'], fill: 'hsl(32 95% 62%)' },
        { name: 'En panne', value: statusCounts['En panne'], fill: 'hsl(0 84% 60%)' },
      ];
    },

    async getRecentAlerts(limit = 5) {
      const { data, error } = await supabase
        .from('system_alerts')
        .select(`*, vehicles (brand, model, registration)`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(mapAlertFromDb);
    },

    async getRecentVehicles(limit = 5) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(mapVehicleFromDb);
    },
  },

  // ============ HISTORY ============
  history: {
    async getAll(): Promise<HistoryEvent[]> {
      const [maintenanceRes, breakdownsRes, reservationsRes, fuelLogsRes] = await Promise.all([
        supabase.from('maintenance_logs').select('*, vehicles (brand, model, registration)').order('created_at', { ascending: false }).limit(50),
        supabase.from('incidents').select('*, vehicles (brand, model, registration)').order('created_at', { ascending: false }).limit(50),
        supabase.from('assignments').select('*, vehicles (brand, model, registration), drivers (phone)').order('created_at', { ascending: false }).limit(50),
        supabase.from('fuel_logs').select('*, vehicles (brand, model, registration), drivers (phone)').order('created_at', { ascending: false }).limit(50),
      ]);

      const events: HistoryEvent[] = [];

      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      };

      const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      };

      // Map maintenance
      maintenanceRes.data?.forEach(m => {
        const rawDate = new Date(m.created_at || '');
        const vehicleInfo = m.vehicles
          ? `${m.vehicles.brand} ${m.vehicles.model} (${m.vehicles.registration})`
          : null;
        events.push({
          id: `maintenance-${m.id}`,
          type: 'maintenance',
          title: m.status === 'Terminé' ? 'Entretien terminé' : m.status === 'En cours' ? 'Entretien en cours' : 'Entretien planifié',
          description: `${m.type}${m.cost ? ` - ${formatCurrencyValue(Number(m.cost))}` : ''}`,
          date: formatDate(m.created_at || ''),
          time: formatTime(m.created_at || ''),
          vehicle: m.vehicles ? `${m.vehicles.brand} ${m.vehicles.model}` : 'Véhicule inconnu',
          plate: m.vehicles?.registration || '',
          user: 'Système',
          rawDate,
          vehicleInfo,
        });
      });

      // Map breakdowns
      breakdownsRes.data?.forEach(b => {
        const rawDate = new Date(b.created_at || '');
        const vehicleInfo = b.vehicles
          ? `${b.vehicles.brand} ${b.vehicles.model} (${b.vehicles.registration})`
          : null;
        events.push({
          id: `breakdown-${b.id}`,
          type: 'breakdown',
          title: b.status === 'Résolu' ? 'Panne résolue' : 'Panne signalée',
          description: `${b.description}${b.repair_cost ? ` - ${formatCurrencyValue(Number(b.repair_cost))}` : ''}`,
          date: formatDate(b.created_at || ''),
          time: formatTime(b.created_at || ''),
          vehicle: b.vehicles ? `${b.vehicles.brand} ${b.vehicles.model}` : 'Véhicule inconnu',
          plate: b.vehicles?.registration || '',
          user: 'Système',
          rawDate,
          vehicleInfo,
        });
      });

      // Map reservations
      reservationsRes.data?.forEach(r => {
        const rawDate = new Date(r.created_at || '');
        const vehicleInfo = r.vehicles
          ? `${r.vehicles.brand} ${r.vehicles.model} (${r.vehicles.registration})`
          : null;
        const statusText = r.status === 'Confirmée' ? 'Réservation confirmée' : 
                          r.status === 'Terminée' ? 'Réservation terminée' : 
                          r.status === 'Annulée' ? 'Réservation annulée' : 'Nouvelle réservation';
        events.push({
          id: `reservation-${r.id}`,
          type: 'reservation',
          title: statusText,
          description: r.destination ? `Mission: ${r.destination}` : (r.purpose || 'Réservation'),
          date: formatDate(r.created_at || ''),
          time: formatTime(r.created_at || ''),
          vehicle: r.vehicles ? `${r.vehicles.brand} ${r.vehicles.model}` : 'Véhicule inconnu',
          plate: r.vehicles?.registration || '',
          user: r.drivers?.phone || 'Non assigné',
          rawDate,
          vehicleInfo,
        });
      });

      // Map fuel logs
      fuelLogsRes.data?.forEach(f => {
        const rawDate = new Date(f.created_at || '');
        const vehicleInfo = f.vehicles
          ? `${f.vehicles.brand} ${f.vehicles.model} (${f.vehicles.registration})`
          : null;
        events.push({
          id: `fuel-${f.id}`,
          type: 'fuel',
          title: 'Plein de carburant',
          description: `${Number(f.liters).toFixed(1)}L - ${formatCurrencyValue(Number(f.cost))}`,
          date: formatDate(f.created_at || ''),
          time: formatTime(f.created_at || ''),
          vehicle: f.vehicles ? `${f.vehicles.brand} ${f.vehicles.model}` : 'Véhicule inconnu',
          plate: f.vehicles?.registration || '',
          user: f.drivers?.phone || 'Non renseigné',
          rawDate,
          vehicleInfo,
        });
      });

      // Sort by date descending
      return events.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    },
  },
};

export default supabaseAdapter;
