import axiosInstance from '../fetcher';
import { Branch, BranchesResponse } from '../types';

/**
 * Get all branches for a given country code
 * @param countryCode - Country code (default: 'UAE')
 * @returns Promise<Branch[]>
 */
export const getAllBranches = async (countryCode: string = 'UAE'): Promise<Branch[]> => {
  try {
    const response = await axiosInstance.get<BranchesResponse>(
      `/api/branch/all?countryCode=${countryCode}`
    );
    
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

