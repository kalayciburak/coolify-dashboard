import { extractFqdns } from "../utils/urlUtils";
import { RESOURCE_TYPES } from "../constants/resourceTypes";

export const mapApplication = (app) => ({
  ...app,
  type: RESOURCE_TYPES.APPLICATION,
  fqdns: extractFqdns(app.fqdn),
});

export const mapService = (service) => {
  const serviceFqdns = [];

  if (service.applications && service.applications.length > 0) {
    service.applications.forEach((app) => {
      if (app.fqdn) {
        serviceFqdns.push(...extractFqdns(app.fqdn));
      }
    });
  }

  if (service.fqdn) {
    serviceFqdns.push(...extractFqdns(service.fqdn));
  }

  return {
    ...service,
    type: RESOURCE_TYPES.SERVICE,
    fqdns: [...new Set(serviceFqdns)],
    status: service.status || service.applications?.[0]?.status,
  };
};

export const mapDatabase = (db) => ({
  ...db,
  type: RESOURCE_TYPES.DATABASE,
  name: db.name,
  fqdns: db.external_db_url ? [db.external_db_url] : [],
  status: db.status,
  database_type: db.database_type,
});
