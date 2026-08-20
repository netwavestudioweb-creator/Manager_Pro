/**
 * Reservation Hooks - Using Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '@/services';
import type { Reservation, ReservationCreate, ReservationUpdate } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

// Re-export types for backward compatibility
export type { Reservation, ReservationCreate, ReservationUpdate };

// Alias for backward compatibility
export type ReservationWithDetails = Reservation;

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationService.getAll(),
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reservation: ReservationCreate) => reservationService.create(reservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Réservation créée',
        description: 'La réservation a été créée avec succès',
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

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reservation: ReservationUpdate) => reservationService.update(reservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Réservation mise à jour',
        description: 'La réservation a été mise à jour avec succès',
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

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => reservationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Réservation supprimée',
        description: 'La réservation a été supprimée avec succès',
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
