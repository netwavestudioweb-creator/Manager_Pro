/**
 * Breakdown Hooks - Using Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { breakdownService } from '@/services';
import type { Breakdown, BreakdownCreate, BreakdownUpdate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { Breakdown, BreakdownCreate, BreakdownUpdate };

// Alias for backward compatibility
export type BreakdownWithVehicle = Breakdown;

export const useBreakdowns = () => {
  return useQuery({
    queryKey: ['breakdowns'],
    queryFn: () => breakdownService.getAll(),
  });
};

export const useCreateBreakdown = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (breakdown: BreakdownCreate) => breakdownService.create(breakdown),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breakdowns'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Panne signalée',
        description: 'La panne a été enregistrée avec succès',
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

export const useUpdateBreakdown = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (breakdown: BreakdownUpdate) => breakdownService.update(breakdown),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breakdowns'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Panne mise à jour',
        description: 'La panne a été mise à jour avec succès',
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

export const useDeleteBreakdown = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => breakdownService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breakdowns'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Panne supprimée',
        description: 'La panne a été supprimée avec succès',
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
