/**
 * Vehicle Hooks - Using Service Layer
 * These hooks use the vehicleService instead of direct Supabase calls.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services';
import type { Vehicle, VehicleCreate, VehicleUpdate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { Vehicle, VehicleCreate, VehicleUpdate };

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll(),
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (vehicle: VehicleCreate) => vehicleService.create(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Véhicule ajouté',
        description: 'Le véhicule a été ajouté avec succès',
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

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (vehicle: VehicleUpdate) => vehicleService.update(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Véhicule modifié',
        description: 'Le véhicule a été modifié avec succès',
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

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Véhicule supprimé',
        description: 'Le véhicule a été supprimé avec succès',
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
