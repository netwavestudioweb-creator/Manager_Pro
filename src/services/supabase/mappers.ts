/**
 * Supabase Data Mappers
 * Convert between Supabase format and service types.
 * These mappers maintain snake_case for backward compatibility with existing UI components.
 */

import type { Tables } from '@/integrations/supabase/types';
import type {
  Vehicle,
  VehicleCreate,
  Driver,
  DriverCreate,
  Maintenance,
  MaintenanceCreate,
  Breakdown,
  BreakdownCreate,
  Reservation,
  ReservationCreate,
  FuelLog,
  FuelLogCreate,
  Alert,
  Profile,
  User,
  UserSession,
} from '../api/types';

// ============ Vehicle Mappers ============

export function mapVehicleFromDb(data: Tables<'vehicles'>): Vehicle {
  return {
    id: data.id,
    brand: data.brand,
    model: data.model,
    year: data.year ?? 0,
    registration: data.registration,
    fuel_type: data.fuel_type ?? 'Diesel',
    category: data.category,
    mileage: data.current_mileage ?? data.initial_mileage ?? 0,
    status: (data.status as any) ?? 'Disponible',
    photo_url: data.photo_url,
    purchase_date: data.purchase_date,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
  };
}

export function mapVehicleToDb(data: VehicleCreate) {
  return {
    brand: data.brand,
    model: data.model,
    year: data.year,
    registration: data.registration,
    fuel_type: data.fuel_type ?? 'Diesel',
    category: data.category ?? null,
    current_mileage: data.mileage ?? 0,
    status: data.status ?? 'Disponible',
    photo_url: data.photo_url ?? null,
    purchase_date: data.purchase_date ?? null,
  };
}

// ============ Driver Mappers ============

export function mapDriverFromDb(data: Tables<'drivers'>): Driver {
  return {
    id: data.id,
    full_name: data.phone || 'Chauffeur', // Fallback since full_name might not be there if users table isn't joined
    email: null,
    phone: data.phone,
    license_number: data.license_number,
    license_expiry: data.license_expiry,
    photo_url: null,
    is_active: data.status === 'Actif',
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
  };
}

export function mapDriverToDb(data: DriverCreate) {
  return {
    phone: data.phone ?? null,
    license_number: data.license_number ?? null,
    license_expiry: data.license_expiry ?? null,
    status: data.is_active !== false ? 'Actif' : 'Suspendu',
  };
}

// ============ Maintenance Mappers ============

type MaintenanceWithVehicle = Tables<'maintenance_logs'> & {
  vehicles?: { brand: string; model: string; registration: string } | null;
};

export function mapMaintenanceFromDb(data: MaintenanceWithVehicle): Maintenance {
  return {
    id: data.id,
    vehicle_id: data.vehicle_id!,
    type: data.type ?? 'Préventif',
    description: data.description,
    cost: Number(data.cost ?? 0),
    status: (data.status as any) ?? 'Prévu',
    scheduled_date: data.scheduled_date,
    completed_date: data.completed_date,
    mileage_at_service: data.mileage_at_service,
    next_service_date: data.next_service_date,
    next_service_mileage: data.next_service_mileage,
    created_by: null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
    vehicles: data.vehicles ?? null,
  };
}

export function mapMaintenanceToDb(data: MaintenanceCreate) {
  return {
    vehicle_id: data.vehicle_id,
    type: data.type,
    description: data.description ?? null,
    cost: data.cost ?? 0,
    status: data.status ?? 'Prévu',
    scheduled_date: data.scheduled_date ?? null,
    completed_date: data.completed_date ?? null,
    mileage_at_service: data.mileage_at_service ?? null,
    next_service_date: data.next_service_date ?? null,
    next_service_mileage: data.next_service_mileage ?? null,
  };
}

// ============ Breakdown (Incidents) Mappers ============

type BreakdownWithVehicle = Tables<'incidents'> & {
  vehicles?: { brand: string; model: string; registration: string } | null;
};

export function mapBreakdownFromDb(data: BreakdownWithVehicle): Breakdown {
  return {
    id: data.id,
    vehicle_id: data.vehicle_id!,
    description: data.description,
    status: (data.status === 'Résolu' ? 'Résolue' : 'Ouverte') as any,
    severity: (data.severity as any) ?? 'Moyenne',
    reported_date: data.reported_date,
    reported_by: data.driver_id,
    resolved_date: data.status === 'Résolu' ? (data.created_at ?? new Date().toISOString()) : null,
    resolution_notes: data.resolution_notes,
    repair_cost: data.repair_cost ? Number(data.repair_cost) : null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
    vehicles: data.vehicles ?? null,
  };
}

export function mapBreakdownToDb(data: BreakdownCreate) {
  return {
    vehicle_id: data.vehicle_id,
    description: data.description,
    status: data.status === 'Résolue' ? 'Résolu' : 'Ouvert',
    severity: data.severity ?? 'Moyenne',
    reported_date: data.reported_date ?? new Date().toISOString(),
    resolution_notes: data.resolution_notes ?? null,
    repair_cost: data.repair_cost ?? null,
  };
}

// ============ Reservation (Assignments) Mappers ============

type ReservationWithDetails = Tables<'assignments'> & {
  vehicles?: { brand: string; model: string; registration: string } | null;
  drivers?: { phone: string | null } | null;
};

export function mapReservationFromDb(data: ReservationWithDetails): Reservation {
  return {
    id: data.id,
    vehicle_id: data.vehicle_id!,
    driver_id: data.driver_id,
    start_date: data.start_date,
    end_date: data.end_date ?? data.start_date,
    purpose: data.purpose,
    destination: data.destination,
    status: (data.status as any) ?? 'En attente',
    notes: null,
    created_by: null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
    vehicles: data.vehicles ?? null,
    drivers: data.drivers ? { full_name: data.drivers.phone || 'Chauffeur' } : null,
  };
}

export function mapReservationToDb(data: ReservationCreate) {
  return {
    vehicle_id: data.vehicle_id,
    driver_id: data.driver_id ?? null,
    start_date: data.start_date,
    end_date: data.end_date,
    purpose: data.purpose ?? null,
    destination: data.destination ?? null,
    status: data.status ?? 'En attente',
  };
}

// ============ Fuel Log Mappers ============

type FuelLogWithDetails = Tables<'fuel_logs'> & {
  vehicles?: { brand: string; model: string; registration: string } | null;
  drivers?: { phone: string | null } | null;
};

export function mapFuelLogFromDb(data: FuelLogWithDetails): FuelLog {
  return {
    id: data.id,
    vehicle_id: data.vehicle_id!,
    driver_id: data.driver_id,
    date: data.date,
    liters: Number(data.liters),
    cost: Number(data.cost),
    mileage: data.mileage,
    station: data.station,
    fuel_type: 'Diesel',
    created_by: null,
    created_at: data.created_at ?? new Date().toISOString(),
    vehicles: data.vehicles ?? null,
    drivers: data.drivers ? { full_name: data.drivers.phone || 'Chauffeur' } : null,
  };
}

export function mapFuelLogToDb(data: FuelLogCreate) {
  return {
    vehicle_id: data.vehicle_id,
    driver_id: data.driver_id ?? null,
    date: data.date ?? new Date().toISOString(),
    liters: data.liters,
    cost: data.cost,
    mileage: data.mileage,
    station: data.station ?? null,
  };
}

// ============ Alert Mappers ============

type AlertWithVehicle = Tables<'system_alerts'> & {
  vehicles?: { brand: string; model: string; registration: string } | null;
};

export function mapAlertFromDb(data: AlertWithVehicle): Alert {
  return {
    id: data.id,
    type: data.type ?? 'info',
    message: data.message,
    priority: (data.priority as any) ?? 'info',
    vehicle_id: data.vehicle_id,
    due_date: data.due_date,
    is_read: data.is_read ?? false,
    created_at: data.created_at ?? new Date().toISOString(),
    vehicles: data.vehicles ?? null,
  };
}

// ============ Profile Mappers ============

export function mapProfileFromDb(data: Tables<'users'>): Profile {
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    avatar_url: null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.created_at ?? new Date().toISOString(),
  };
}

// ============ Auth Mappers ============

export function mapUserFromSupabase(user: { id: string; email?: string; created_at?: string }): User {
  return {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at,
  };
}

export function mapSessionFromSupabase(session: { user: { id: string; email?: string }; access_token?: string; expires_at?: number } | null): UserSession | null {
  if (!session) return null;
  return {
    user: mapUserFromSupabase(session.user),
    access_token: session.access_token,
    expires_at: session.expires_at,
  };
}
