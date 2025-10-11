import axios from "axios";
import {
  mapApplication,
  mapService,
  mapDatabase,
} from "../services/resourceMapper";

let runtimeConfig = null;

const fetchRuntimeConfig = async () => {
  if (runtimeConfig) return runtimeConfig;

  try {
    const response = await fetch("/api/config");
    runtimeConfig = await response.json();
    return runtimeConfig;
  } catch (error) {
    return {
      coolifyBaseUrl: "",
      coolifyToken: "",
    };
  }
};

const BASE_URL = "";
const TOKEN = "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const config_data = await fetchRuntimeConfig();
  config.baseURL = config_data.coolifyBaseUrl + "/api/v1";
  config.headers.Authorization = `Bearer ${config_data.coolifyToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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

  const applications = appsResponse.data
    .filter((app) => !app.name?.toLowerCase().includes("coolify-dashboard"))
    .map(mapApplication);
  const services = servicesResponse.data
    .filter(
      (service) => !service.name?.toLowerCase().includes("coolify-dashboard")
    )
    .map(mapService);
  const databases = (databasesResponse.data || [])
    .filter((db) => !db.name?.toLowerCase().includes("coolify-dashboard"))
    .map(mapDatabase);

  return [...applications, ...services, ...databases];
};
