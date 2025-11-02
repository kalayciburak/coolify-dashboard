import ResourceDetails from "../../resource/ResourceDetails";
import DatabaseInfo from "../../resource/DatabaseInfo";
import ComponentsList from "../../resource/ComponentsList";
import { RESOURCE_TYPES } from "../../../constants/resourceTypes";

/**
 * ResourceCardBody - Expanded content area for resource details
 *
 * SOLID Principles:
 * - Single Responsibility: Only displays expanded resource details
 * - Open/Closed: New resource types can add their own details sections
 * - Dependency Inversion: Uses child components, doesn't know their implementation
 *
 * Displays:
 * - Resource details (common for all types)
 * - Database info (databases only)
 * - Components list (services with sub-resources)
 */
const ResourceCardBody = ({ resource }) => {
  return (
    <div className="bg-slate-800/30 border-t border-white/10 px-3 md:px-8 py-4 md:py-6">
      {/* Common resource details */}
      <ResourceDetails resource={resource} />

      {/* Database-specific information */}
      {resource.type === RESOURCE_TYPES.DATABASE && (
        <div className="mt-4">
          <DatabaseInfo resource={resource} />
        </div>
      )}

      {/* Components list (for services with sub-resources) */}
      <div className="mt-4">
        <ComponentsList
          applications={resource.applications}
          databases={resource.databases}
        />
      </div>
    </div>
  );
};

export default ResourceCardBody;
