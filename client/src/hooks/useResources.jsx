import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import resourceRepository from "../repositories/ResourceRepository";
import { RESOURCE_TYPES } from "../constants/resourceTypes";

/**
 * Hook to fetch and manage resources using React Query
 * Provides automatic caching, background refetching, and optimistic updates
 */
export const useResources = (options = {}) => {
  const {
    refetchInterval = 5000, // Poll every 5 seconds
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const allResources = await resourceRepository.fetchAll();

      return {
        applications: allResources.filter(
          (r) => r.type === RESOURCE_TYPES.APPLICATION
        ),
        services: allResources.filter((r) => r.type === RESOURCE_TYPES.SERVICE),
        databases: allResources.filter((r) => r.type === RESOURCE_TYPES.DATABASE),
        all: allResources,
      };
    },
    refetchInterval, // Automatic polling
    refetchIntervalInBackground: true, // Continue polling when tab is not active
    staleTime: 4000, // Data is fresh for 4 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    enabled,
  });
};

/**
 * Hook for resource mutations (start, stop, delete)
 */
export const useResourceMutations = () => {
  const queryClient = useQueryClient();

  const startResource = useMutation({
    mutationFn: ({ type, uuid }) => resourceRepository.start(type, uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const stopResource = useMutation({
    mutationFn: ({ type, uuid }) => resourceRepository.stop(type, uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const deleteResource = useMutation({
    mutationFn: ({ type, uuid }) => resourceRepository.delete(type, uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  return {
    startResource,
    stopResource,
    deleteResource,
  };
};

/**
 * Hook to manually refetch resources
 */
export const useRefetchResources = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ["resources"] });
};
