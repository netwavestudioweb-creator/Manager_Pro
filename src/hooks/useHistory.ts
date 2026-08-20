/**
 * History Hook
 * Uses the service layer for data access
 */

import { useQuery } from '@tanstack/react-query';
import { historyService } from '@/services';
import type { HistoryEvent } from '@/services/api/types';

export type { HistoryEvent };

export const useHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => historyService.getAll(),
  });
};
