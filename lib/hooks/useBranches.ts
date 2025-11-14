import { useQuery } from '@tanstack/react-query';
import { getAllBranches, Branch } from '../api';

export const useBranches = (countryCode: string = 'UAE') => {
  return useQuery<Branch[]>({
    queryKey: ['branches', countryCode],
    queryFn: () => getAllBranches(countryCode),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

