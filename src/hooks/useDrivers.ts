/**
 * Driver Hooks - Using Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services';
import type { Driver, DriverCreate, DriverUpdate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { Driver, DriverCreate, DriverUpdate };

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAll(),
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (driver: DriverCreate) => driverService.create(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Chauffeur ajouté',
        description: 'Le chauffeur a été ajouté avec succès',
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

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (driver: DriverUpdate) => driverService.update(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast({
        title: 'Chauffeur modifié',
        description: 'Le chauffeur a été modifié avec succès',
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

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => driverService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Chauffeur supprimé',
        description: 'Le chauffeur a été supprimé avec succès',
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
