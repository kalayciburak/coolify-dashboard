import axios from "axios";
import {
  mapApplication,
  mapService,
  mapDatabase,
} from "../services/resourceMapper";

const api = axios.create({
  baseURL: "/api/coolify",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching data";
    throw new Error(message);
  }
);

export const fetchAllResources = async () => {
  const [appsResponse, servicesResponse, databasesResponse] = await Promise.all(
    [
      api.get("/applications"),
      api.get("/services"),
      api.get("/databases").catch(() => ({ data: [] })),
    ]
  );

  const isDashboardResource = (resource) => {
    const name = resource.name?.toLowerCase() || "";
    return name.includes("coolify-dashboard") || name.includes("dashboard");
  };

  const applications = appsResponse.data
    .filter((app) => !isDashboardResource(app))
    .map(mapApplication);
  const services = servicesResponse.data
    .filter((service) => !isDashboardResource(service))
    .map(mapService);
  const databases = (databasesResponse.data || [])
    .filter((db) => !isDashboardResource(db))
    .map(mapDatabase);

  return [...applications, ...services, ...databases];
};

export const getUserType = async () => {
  const response = await api.get("/user-type");
  return response.data.userType;
};

export const startResource = async (type, uuid) => {
  const response = await api.post(`/${type}s/${uuid}/start`);
  return response.data;
};

export const stopResource = async (type, uuid) => {
  const response = await api.post(`/${type}s/${uuid}/stop`);
  return response.data;
};

export const deleteResource = async (type, uuid) => {
  const response = await api.delete(`/${type}s/${uuid}`);
  return response.data;
};

export const getResourceLogs = async (type, uuid) => {
  const response = await api.get(`/${type}s/${uuid}/logs`);
  return response.data;
};
