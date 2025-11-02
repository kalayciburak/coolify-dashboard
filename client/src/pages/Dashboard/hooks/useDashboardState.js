import { useState, useEffect, useMemo } from "react";
import useResourceStore from "../../../store/resourceStore";
import {
  filterDashboardResources,
  filterAndSortResources,
} from "../../../services/resourceService";

/**
 * useDashboardState - Custom hook for Dashboard state management
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages dashboard state and derived data
 * - Dependency Inversion: Uses resourceStore abstraction
 * - Interface Segregation: Returns clean, focused interface
 *
 * This hook encapsulates all Dashboard state logic, making the component
 * a pure presentation layer (orchestrator).
 */
const useDashboardState = () => {
  // Resource store
  const {
    applications: storeApplications,
    services: storeServices,
    databases: storeDatabases,
    loading,
    error,
    fetchResources,
    cleanup,
  } = useResourceStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("applications");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize and cleanup
  useEffect(() => {
    fetchResources().finally(() => setIsInitialLoad(false));
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter dashboard resources (remove self)
  const applications = useMemo(
    () => filterDashboardResources(storeApplications),
    [storeApplications]
  );

  const services = useMemo(
    () => filterDashboardResources(storeServices),
    [storeServices]
  );

  const databases = useMemo(
    () => filterDashboardResources(storeDatabases),
    [storeDatabases]
  );

  // Combine all resources
  const allResources = useMemo(
    () => [...applications, ...services, ...databases],
    [applications, services, databases]
  );

  // Filtered and sorted resources based on current view
  const filteredResources = useMemo(
    () =>
      filterAndSortResources(
        allResources,
        activeView,
        searchTerm,
        sortBy,
        sortOrder
      ),
    [allResources, activeView, searchTerm, sortBy, sortOrder]
  );

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchResources();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Clear sort handler
  const handleClearSort = () => {
    setSortBy("name");
    setSortOrder("asc");
  };

  return {
    // State
    searchTerm,
    activeView,
    sortBy,
    sortOrder,
    isRefreshing,
    isInitialLoad,
    loading,
    error,

    // Data
    applications,
    services,
    databases,
    filteredResources,

    // Counts
    resourceCounts: {
      applications: applications.length,
      services: services.length,
      databases: databases.length,
    },

    // Handlers
    setSearchTerm,
    setActiveView,
    setSortBy,
    setSortOrder,
    handleRefresh,
    handleSort,
    handleClearSort,
  };
};

export default useDashboardState;
