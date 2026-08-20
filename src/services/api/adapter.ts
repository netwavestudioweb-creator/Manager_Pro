/**
 * Database Adapter Interface
 * This abstract interface allows swapping backend implementations.
 * Currently implemented: Supabase
 * Future: REST API, GraphQL, etc.
 */

import type {
  User,
  UserSession,
  AppRole,
  Profile,
  SignInCredentials,
  SignUpCredentials,
  Vehicle,
  VehicleCreate,
  VehicleUpdate,
  Driver,
  DriverCreate,
  DriverUpdate,
  Maintenance,
  MaintenanceCreate,
  MaintenanceUpdate,
  Breakdown,
  BreakdownCreate,
  BreakdownUpdate,
  Reservation,
  ReservationCreate,
  ReservationUpdate,
  FuelLog,
  FuelLogCreate,
  Alert,
  AlertUpdate,
  DashboardStats,
  VehicleStatusChartData,
  HistoryEvent,
} from './types';

export interface AuthAdapter {
  // Session management
  getSession(): Promise<UserSession | null>;
  onAuthStateChange(callback: (session: UserSession | null) => void): () => void;
  
  // Authentication
  signIn(credentials: SignInCredentials): Promise<{ error: Error | null }>;
  signUp(credentials: SignUpCredentials): Promise<{ error: Error | null }>;
  signOut(): Promise<void>;
  
  // Password
  updatePassword(newPassword: string): Promise<{ error: Error | null }>;
  
  // Roles
  getUserRole(userId: string): Promise<AppRole | null>;
  
  // Profile
  getProfile(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, data: Partial<Profile>): Promise<{ error: Error | null }>;
}

export interface VehicleAdapter {
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle | null>;
  create(data: VehicleCreate): Promise<Vehicle>;
  update(data: VehicleUpdate): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}

export interface DriverAdapter {
  getAll(): Promise<Driver[]>;
  getById(id: string): Promise<Driver | null>;
  create(data: DriverCreate): Promise<Driver>;
  update(data: DriverUpdate): Promise<Driver>;
  delete(id: string): Promise<void>;
}

export interface MaintenanceAdapter {
  getAll(): Promise<Maintenance[]>;
  getById(id: string): Promise<Maintenance | null>;
  create(data: MaintenanceCreate): Promise<Maintenance>;
  update(data: MaintenanceUpdate): Promise<Maintenance>;
  delete(id: string): Promise<void>;
}

export interface BreakdownAdapter {
  getAll(): Promise<Breakdown[]>;
  getById(id: string): Promise<Breakdown | null>;
  create(data: BreakdownCreate): Promise<Breakdown>;
  update(data: BreakdownUpdate): Promise<Breakdown>;
  delete(id: string): Promise<void>;
}

export interface ReservationAdapter {
  getAll(): Promise<Reservation[]>;
  getById(id: string): Promise<Reservation | null>;
  create(data: ReservationCreate): Promise<Reservation>;
  update(data: ReservationUpdate): Promise<Reservation>;
  delete(id: string): Promise<void>;
}

export interface FuelLogAdapter {
  getAll(): Promise<FuelLog[]>;
  getById(id: string): Promise<FuelLog | null>;
  create(data: FuelLogCreate): Promise<FuelLog>;
  delete(id: string): Promise<void>;
}

export interface AlertAdapter {
  getAll(): Promise<Alert[]>;
  getRecent(limit?: number): Promise<Alert[]>;
  update(data: AlertUpdate): Promise<Alert>;
  markAsRead(id: string): Promise<Alert>;
  markAllAsRead(): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface DashboardAdapter {
  getStats(): Promise<DashboardStats>;
  getVehicleStatusChart(): Promise<VehicleStatusChartData[]>;
  getRecentAlerts(limit?: number): Promise<Alert[]>;
  getRecentVehicles(limit?: number): Promise<Vehicle[]>;
}

export interface HistoryAdapter {
  getAll(): Promise<HistoryEvent[]>;
}

/**
 * Complete Database Adapter Interface
 * Implement this interface to add a new backend
 */
export interface DatabaseAdapter {
  auth: AuthAdapter;
  vehicles: VehicleAdapter;
  drivers: DriverAdapter;
  maintenance: MaintenanceAdapter;
  breakdowns: BreakdownAdapter;
  reservations: ReservationAdapter;
  fuelLogs: FuelLogAdapter;
  alerts: AlertAdapter;
  dashboard: DashboardAdapter;
  history: HistoryAdapter;
}
