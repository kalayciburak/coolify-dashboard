import { useState, useMemo } from "react";
import { useResources, useRefetchResources } from "../../../hooks/useResources";
import {
  filterDashboardResources,
  filterAndSortResources,
} from "../../../services/resourceService";

const useDashboardState = () => {
  const {
    data: resourcesData,
    isLoading: loading,
    error,
    isInitialLoading: isInitialLoad,
  } = useResources();

  const refetchResources = useRefetchResources();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("applications");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const storeApplications = resourcesData?.applications || [];
  const storeServices = resourcesData?.services || [];
  const storeDatabases = resourcesData?.databases || [];

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

  const allResources = useMemo(
    () => [...applications, ...services, ...databases],
    [applications, services, databases]
  );

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchResources();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleClearSort = () => {
    setSortBy("name");
    setSortOrder("asc");
  };

  return {
    searchTerm,
    activeView,
    sortBy,
    sortOrder,
    isRefreshing,
    isInitialLoad,
    loading,
    error: error?.message || null,

    applications,
    services,
    databases,
    filteredResources,

    resourceCounts: {
      applications: applications.length,
      services: services.length,
      databases: databases.length,
    },

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
