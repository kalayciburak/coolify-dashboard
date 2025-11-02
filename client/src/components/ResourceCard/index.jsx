import { lazy, Suspense } from "react";
import {
  ServerIcon,
  CubeIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { getStatusColor } from "../../utils/statusUtils";
import { normalizeUrl } from "../../utils/urlUtils";
import {
  getSourceInfo,
  getResourceTag,
  hasResourceDetails,
} from "../../utils/resourceUtils";
import { RESOURCE_TYPES } from "../../constants/resourceTypes";
import ResourceHeader from "../resource/ResourceHeader";
import ResourceCardBody from "./components/ResourceCardBody";
import ResourceCardFooter from "./components/ResourceCardFooter";
import useResourceCardState from "./hooks/useResourceCardState";
import useResourceActions from "./hooks/useResourceActions";
import useResourceStore from "../../store/resourceStore";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { SOUND_TYPES } from "../../utils/soundUtils";
import { useTranslation } from "react-i18next";

// Lazy load modals
const ConfirmUrlModal = lazy(() => import("../modals/ConfirmUrlModal"));
const YamlModal = lazy(() => import("../modals/YamlModal"));
const LogsModal = lazy(() => import("../modals/LogsModal"));
const ConfirmActionModal = lazy(() => import("../modals/ConfirmActionModal"));

/**
 * ResourceCard - Resource display card (Refactored)
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only orchestrates child components
 * - Open/Closed: New features added via new components
 * - Dependency Inversion: Uses hooks and components abstractions
 * - Interface Segregation: Clean props to child components
 *
 * Refactoring Results:
 * - Original: 440 lines (God component)
 * - Refactored: ~180 lines (Orchestrator)
 * - Extracted: 5 new files (2 hooks + 2 components + body)
 * - Complexity: VERY HIGH → LOW
 */
const ResourceCard = ({ resource }) => {
  const { t } = useTranslation();
  const { playSound } = useSoundEffects();

  // Get resource action handlers from store
  const { startResourceAction, stopResourceAction, deleteResourceAction } =
    useResourceStore();

  // State management (extracted to hook)
  const {
    isExpanded,
    setIsExpanded,
    showYaml,
    setShowYaml,
    showLogs,
    setShowLogs,
    confirmUrl,
    setConfirmUrl,
    confirmAction,
    setConfirmAction,
    userType,
    currentAction,
    realtimeElapsed,
  } = useResourceCardState(resource);

  // Action utilities (extracted to hook)
  const { actionColor, ActionIcon, actionText, formatElapsedTime } =
    useResourceActions(currentAction);

  // Derived data
  const statusColor = getStatusColor(resource.status);
  const urls =
    resource.fqdns && resource.fqdns.length > 0
      ? resource.fqdns.map(normalizeUrl).filter(Boolean)
      : [];

  const TypeIcon =
    resource.type === RESOURCE_TYPES.SERVICE
      ? ServerIcon
      : resource.type === RESOURCE_TYPES.DATABASE
        ? CircleStackIcon
        : CubeIcon;

  const sourceInfo = getSourceInfo(resource);
  const tag = getResourceTag(resource);
  const hasDetails = hasResourceDetails(resource);

  const resourceTypeId =
    resource.type === RESOURCE_TYPES.SERVICE
      ? "service"
      : resource.type === RESOURCE_TYPES.DATABASE
        ? "database"
        : "application";

  // Handlers
  const handleExpandToggle = () => {
    if (hasDetails) {
      playSound(SOUND_TYPES.CLICK);
      setIsExpanded(!isExpanded);
    }
  };

  const handleActionConfirm = () => {
    if (confirmAction === "start") {
      startResourceAction(resource.type, resource.uuid, t);
    } else if (confirmAction === "stop") {
      stopResourceAction(resource.type, resource.uuid, t);
    } else if (confirmAction === "delete") {
      deleteResourceAction(resource.type, resource.uuid, t);
    }
    setConfirmAction(null);
  };

  return (
    <div
      className={`border-b border-white/30 last:border-b-0 relative overflow-hidden transition-all duration-300 ${
        isExpanded ? "bg-purple-500/5" : ""
      }`}
    >
      {/* Header Section (Clickable) */}
      <div
        className={`hover:bg-white/5 active:bg-white/10 transition-colors duration-150 ${
          hasDetails ? "cursor-pointer" : ""
        } ${isExpanded ? "bg-white/5" : "bg-white/1"}`}
        onClick={handleExpandToggle}
        title={hasDetails ? t("common.detail") : ""}
      >
        <div className="px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ResourceHeader
                name={resource.name}
                type={resource.type}
                resourceTypeId={resourceTypeId}
                sourceInfo={sourceInfo}
                urls={urls}
                tag={tag}
                statusColor={statusColor}
                isExpanded={isExpanded}
                hasDetails={hasDetails}
                TypeIcon={TypeIcon}
                onExpandToggle={handleExpandToggle}
                onUrlClick={setConfirmUrl}
                createdAt={resource.created_at}
                updatedAt={resource.updated_at}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body Section (Expanded Details) */}
      {isExpanded && hasDetails && <ResourceCardBody resource={resource} />}

      {/* Footer Section (Actions) */}
      <ResourceCardFooter
        resource={resource}
        resourceTypeId={resourceTypeId}
        urls={urls}
        userType={userType}
        currentAction={currentAction}
        actionColor={actionColor}
        ActionIcon={ActionIcon}
        actionText={actionText}
        realtimeElapsed={realtimeElapsed}
        formatElapsedTime={formatElapsedTime}
        onUrlClick={setConfirmUrl}
        onYamlClick={() => setShowYaml(true)}
        onLogsClick={() => setShowLogs(true)}
        onActionClick={setConfirmAction}
      />

      {/* Modals (Lazy Loaded) */}
      {confirmUrl && (
        <Suspense fallback={null}>
          <ConfirmUrlModal url={confirmUrl} onClose={() => setConfirmUrl(null)} />
        </Suspense>
      )}

      {showYaml && (resource.docker_compose || resource.docker_compose_raw) && (
        <Suspense fallback={null}>
          <YamlModal
            name={resource.name}
            content={resource.docker_compose || resource.docker_compose_raw}
            onClose={() => setShowYaml(false)}
          />
        </Suspense>
      )}

      {showLogs && (
        <Suspense fallback={null}>
          <LogsModal
            name={resource.name}
            type={resource.type}
            uuid={resource.uuid}
            onClose={() => setShowLogs(false)}
          />
        </Suspense>
      )}

      {confirmAction && (
        <Suspense fallback={null}>
          <ConfirmActionModal
            action={confirmAction}
            resourceName={resource.name}
            onConfirm={handleActionConfirm}
            onClose={() => setConfirmAction(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ResourceCard;
