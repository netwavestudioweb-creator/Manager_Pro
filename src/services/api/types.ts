/**
 * Abstract API Types - Backend Agnostic
 * These interfaces define the contract for data access.
 * They use snake_case to maintain compatibility with existing UI components.
 * 
 * NOTE: When migrating to a REST API, the adapter layer will convert
 * between camelCase API responses and these snake_case types.
 */

// ============ Common Types ============

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryResult<T> {
  data: T[];
  count?: number;
  error?: Error | null;
}

export interface MutationResult<T> {
  data: T | null;
  error?: Error | null;
}

// ============ User & Auth Types ============

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface UserSession {
  user: User | null;
  access_token?: string;
  expires_at?: number;
}

export type AppRole = 'admin' | 'gestionnaire' | 'lecteur';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

// ============ Vehicle Types ============

export type VehicleStatus = 'Disponible' | 'En mission' | 'En panne' | 'En entretien';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  registration: string;
  fuel_type: string;
  category: string | null;
  mileage: number;
  status: VehicleStatus;
  photo_url: string | null;
  photo_url_2: string | null;
  photo_url_3: string | null;
  purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  brand: string;
  model: string;
  year: number;
  registration: string;
  fuel_type?: string;
  category?: string | null;
  mileage?: number;
  status?: VehicleStatus;
  photo_url?: string | null;
  photo_url_2?: string | null;
  photo_url_3?: string | null;
  purchase_date?: string | null;
}

export interface VehicleUpdate extends Partial<VehicleCreate> {
  id: string;
}

// ============ Driver Types ============

export interface Driver {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_expiry: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverCreate {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  license_number?: string | null;
  license_expiry?: string | null;
  photo_url?: string | null;
  is_active?: boolean;
}

export interface DriverUpdate extends Partial<DriverCreate> {
  id: string;
}

// ============ Maintenance Types ============

export type MaintenanceStatus = 'Prévu' | 'En cours' | 'Terminé';

export interface Maintenance {
  id: string;
  vehicle_id: string;
  type: string;
  description: string | null;
  cost: number;
  status: MaintenanceStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  mileage_at_service: number | null;
  next_service_date: string | null;
  next_service_mileage: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  vehicles?: {
    brand: string;
    model: string;
    registration: string;
  } | null;
}

export interface MaintenanceCreate {
  vehicle_id: string;
  type: string;
  description?: string | null;
  cost?: number;
  status?: MaintenanceStatus;
  scheduled_date?: string | null;
  completed_date?: string | null;
  mileage_at_service?: number | null;
  next_service_date?: string | null;
  next_service_mileage?: number | null;
}

export interface MaintenanceUpdate extends Partial<MaintenanceCreate> {
  id: string;
}

// ============ Breakdown Types ============

export type BreakdownStatus = 'Ouverte' | 'Résolue';
export type BreakdownSeverity = 'Faible' | 'Moyenne' | 'Haute' | 'Critique';

export interface Breakdown {
  id: string;
  vehicle_id: string;
  description: string;
  status: BreakdownStatus;
  severity: BreakdownSeverity;
  reported_date: string;
  reported_by: string | null;
  resolved_date: string | null;
  resolution_notes: string | null;
  repair_cost: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  vehicles?: {
    brand: string;
    model: string;
    registration: string;
  } | null;
}

export interface BreakdownCreate {
  vehicle_id: string;
  description: string;
  status?: BreakdownStatus;
  severity?: BreakdownSeverity;
  reported_date?: string;
  reported_by?: string | null;
  resolved_date?: string | null;
  resolution_notes?: string | null;
  repair_cost?: number | null;
}

export interface BreakdownUpdate extends Partial<BreakdownCreate> {
  id: string;
}

// ============ Reservation Types ============

export type ReservationStatus = 'En attente' | 'Confirmée' | 'Annulée' | 'Terminée';

export interface Reservation {
  id: string;
  vehicle_id: string;
  driver_id: string | null;
  start_date: string;
  end_date: string;
  purpose: string | null;
  destination: string | null;
  status: ReservationStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  vehicles?: {
    brand: string;
    model: string;
    registration: string;
  } | null;
  drivers?: {
    full_name: string;
  } | null;
}

export interface ReservationCreate {
  vehicle_id: string;
  driver_id?: string | null;
  start_date: string;
  end_date: string;
  purpose?: string | null;
  destination?: string | null;
  status?: ReservationStatus;
  notes?: string | null;
}

export interface ReservationUpdate extends Partial<ReservationCreate> {
  id: string;
}

// ============ Fuel Log Types ============

export interface FuelLog {
  id: string;
  vehicle_id: string;
  driver_id: string | null;
  date: string;
  liters: number;
  cost: number;
  mileage: number;
  station: string | null;
  fuel_type: string | null;
  created_by: string | null;
  created_at: string;
  // Joined data
  vehicles?: {
    brand: string;
    model: string;
    registration: string;
  } | null;
  drivers?: {
    full_name: string;
  } | null;
}

export interface FuelLogCreate {
  vehicle_id: string;
  driver_id?: string | null;
  date?: string;
  liters: number;
  cost: number;
  mileage: number;
  station?: string | null;
  fuel_type?: string | null;
}

export interface FuelLogUpdate extends Partial<FuelLogCreate> {
  id: string;
}

// ============ Alert Types ============

export type AlertPriority = 'info' | 'warning' | 'urgent';

export interface Alert {
  id: string;
  type: string;
  message: string;
  priority: AlertPriority;
  vehicle_id: string | null;
  due_date: string | null;
  is_read: boolean;
  created_at: string;
  // Joined data
  vehicles?: {
    brand: string;
    model: string;
    registration: string;
  } | null;
}

export interface AlertCreate {
  type: string;
  message: string;
  priority?: AlertPriority;
  vehicle_id?: string | null;
  due_date?: string | null;
  is_read?: boolean;
}

export interface AlertUpdate extends Partial<AlertCreate> {
  id: string;
}

// ============ Dashboard Types ============

export interface DashboardStats {
  totalVehicles: number;
  inMaintenance: number;
  breakdowns: number;
  available: number;
  inMission: number;
  availabilityRate: number;
  activeReservations: number;
  monthlyFuel: number;
  activeDrivers: number;
  monthlyCosts: number;
}

export interface VehicleStatusChartData {
  name: string;
  value: number;
  fill: string;
}

// ============ History Types ============

export type HistoryEventType = 'maintenance' | 'breakdown' | 'reservation' | 'fuel';

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  title: string;
  description: string;
  date: string;
  time: string;
  vehicle: string;
  plate: string;
  user: string;
  rawDate: Date;
  vehicleInfo: string | null;
  metadata?: Record<string, unknown>;
}
