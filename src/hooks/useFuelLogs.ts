/**
 * Fuel Log Hooks - Using Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelLogService } from '@/services';
import type { FuelLog, FuelLogCreate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { FuelLog, FuelLogCreate };

// Alias for backward compatibility
export type FuelLogWithDetails = FuelLog;

export const useFuelLogs = () => {
  return useQuery({
    queryKey: ['fuel_logs'],
    queryFn: () => fuelLogService.getAll(),
  });
};

export const useCreateFuelLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (fuelLog: FuelLogCreate) => fuelLogService.create(fuelLog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel_logs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Plein enregistré',
        description: 'Le plein de carburant a été enregistré avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFuelLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => fuelLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel_logs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Plein supprimé',
        description: "L'enregistrement a été supprimé avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
