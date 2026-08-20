/**
 * Maintenance Hooks - Using Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '@/services';
import type { Maintenance, MaintenanceCreate, MaintenanceUpdate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { Maintenance, MaintenanceCreate, MaintenanceUpdate };

// Alias for backward compatibility
export type MaintenanceWithVehicle = Maintenance;

export const useMaintenance = () => {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: () => maintenanceService.getAll(),
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (maintenance: MaintenanceCreate) => maintenanceService.create(maintenance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({
        title: 'Entretien ajouté',
        description: "L'entretien a été ajouté avec succès",
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

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (maintenance: MaintenanceUpdate) => maintenanceService.update(maintenance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({
        title: 'Entretien modifié',
        description: "L'entretien a été modifié avec succès",
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

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => maintenanceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({
        title: 'Entretien supprimé',
        description: "L'entretien a été supprimé avec succès",
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
