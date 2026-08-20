/**
 * Dashboard Stats Hooks - Using Service Layer
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });
};

export const useVehicleStatusData = () => {
  return useQuery({
    queryKey: ['vehicle-status-chart'],
    queryFn: () => dashboardService.getVehicleStatusChart(),
  });
};

export const useRecentAlerts = () => {
  return useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => dashboardService.getRecentAlerts(5),
  });
};

export const useRecentVehicles = () => {
  return useQuery({
    queryKey: ['recent-vehicles'],
    queryFn: () => dashboardService.getRecentVehicles(5),
  });
};
