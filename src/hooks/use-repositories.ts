import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Repository, CreateRepositoryRequest } from "@/types/repository";

// Get all repositories
export const useRepositories = () => {
  return useQuery<Repository[]>({
    queryKey: ['repositories'],
    queryFn: async () => {
      const response = await axios.get('/repos/');
      return response.data;
    }
  });
};

// Get single repository
export const useRepository = (ownerId: number, repoName: string) => {
  return useQuery<Repository>({
    queryKey: ['repository', ownerId, repoName],
    queryFn: async () => {
      const response = await axios.get(`/repos/${ownerId}/${repoName}/`);
      return response.data;
    },
    enabled: !!ownerId && !!repoName
  });
};

// Create repository
export const useCreateRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Repository, Error, CreateRepositoryRequest>({
    mutationFn: async (data) => {
      const response = await axios.post('/repos/create/', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch repositories list
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    }
  });
};

// Update repository
export const useUpdateRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Repository, Error, { ownerId: number; repoName: string; data: Partial<Repository> }>({
    mutationFn: async ({ ownerId, repoName, data }) => {
      const response = await axios.patch(`/repos/${ownerId}/${repoName}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['repository', data.owner_id, data.name] });
    }
  });
};

// Delete repository
export const useDeleteRepository = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { ownerId: number; repoName: string }>({
    mutationFn: async ({ ownerId, repoName }) => {
      await axios.delete(`/repos/${ownerId}/${repoName}/delete/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    }
  });
};