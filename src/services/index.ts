/**
 * Services Index - Centralized Backend Access
 * 
 * This file exports all services that components and hooks should use.
 * To switch backends, simply change the adapter import here.
 * 
 * Current implementation: Supabase
 * Future: REST API, GraphQL, etc.
 */

import { supabaseAdapter } from './supabase/adapter';
import type { DatabaseAdapter } from './api/adapter';

// Current backend adapter
// To switch to a different backend, change this import
const adapter: DatabaseAdapter = supabaseAdapter;

// ============ Service Exports ============

export const authService = adapter.auth;
export const vehicleService = adapter.vehicles;
export const driverService = adapter.drivers;
export const maintenanceService = adapter.maintenance;
export const breakdownService = adapter.breakdowns;
export const reservationService = adapter.reservations;
export const fuelLogService = adapter.fuelLogs;
export const alertService = adapter.alerts;
export const dashboardService = adapter.dashboard;
export const historyService = adapter.history;

// Export adapter for direct access if needed
export { adapter };

// Re-export types for convenience
export * from './api/types';
