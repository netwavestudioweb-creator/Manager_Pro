/**
 * Profile Hook
 * Uses the service layer for data access
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import type { Profile } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type { Profile };

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return authService.getProfile(user.id);
    },
    enabled: !!user?.id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      const result = await authService.updateProfile(user.id, profile);
      if (result.error) throw result.error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès',
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

export const useUpdatePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      const result = await authService.updatePassword(newPassword);
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      toast({
        title: 'Mot de passe modifié',
        description: 'Votre mot de passe a été mis à jour avec succès',
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
