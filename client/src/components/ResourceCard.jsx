import { useState, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  ServerIcon,
  CubeIcon,
  CircleStackIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getStatusColor } from "../utils/statusUtils";
import { normalizeUrl } from "../utils/urlUtils";
import {
  getSourceInfo,
  getResourceTag,
  hasResourceDetails,
} from "../utils/resourceUtils";
import { RESOURCE_TYPES } from "../constants/resourceTypes";
import ResourceHeader from "./resource/ResourceHeader";
import ResourceDetails from "./resource/ResourceDetails";
import DatabaseInfo from "./resource/DatabaseInfo";
import ComponentsList from "./resource/ComponentsList";
import useResourceStore from "../store/resourceStore";

const ConfirmUrlModal = lazy(() => import("./modals/ConfirmUrlModal"));
const YamlModal = lazy(() => import("./modals/YamlModal"));

const ResourceCard = ({ resource }) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState(null);
  const [realtimeElapsed, setRealtimeElapsed] = useState(0);

  const { actionLoading } = useResourceStore();
  const actionKey = `${resource.type}-${resource.uuid}`;
  const currentAction = actionLoading[actionKey];

  useEffect(() => {
    if (!currentAction) {
      setRealtimeElapsed(0);
      return;
    }

    setRealtimeElapsed(currentAction.elapsedSeconds);

    const interval = setInterval(() => {
      setRealtimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAction?.action]);

  useEffect(() => {
    if (currentAction?.elapsedSeconds) {
      setRealtimeElapsed(currentAction.elapsedSeconds);
    }
  }, [currentAction?.elapsedSeconds]);

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

  const handleExpandToggle = () => {
    if (hasDetails) {
      setIsExpanded(!isExpanded);
    }
  };

  const getActionColor = () => {
    if (!currentAction) return null;
    switch (currentAction.action) {
      case "starting":
        return "green";
      case "stopping":
        return "yellow";
      case "deleting":
        return "red";
      default:
        return null;
    }
  };

  const getActionIcon = () => {
    if (!currentAction) return null;
    switch (currentAction.action) {
      case "starting":
        return PlayIcon;
      case "stopping":
        return StopIcon;
      case "deleting":
        return TrashIcon;
      default:
        return null;
    }
  };

  const actionColor = getActionColor();
  const ActionIcon = getActionIcon();

  const getActionText = () => {
    if (!currentAction) return "";
    return t(`admin.${currentAction.action}`);
  };

  const formatElapsedTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minuteUnit = i18n.language === "tr" ? "d" : "m";
    return `${minutes}${minuteUnit} ${remainingSeconds}s`;
  };

  return (
    <div
      className={`border-b border-white/30 last:border-b-0 relative overflow-hidden transition-all duration-300 ${
        isExpanded ? "bg-purple-500/5" : ""
      }`}
    >
      {/* 🎨 MODERN STATUS BANNER - Glassmorphism Overlay */}
      {ActionIcon && (
        <div className="absolute top-0 left-0 right-0 z-20 p-3 md:p-4 pointer-events-none">
          <div
            className={`
            relative overflow-hidden rounded-lg
            backdrop-blur-xl bg-gradient-to-r
            ${
              actionColor === "green"
                ? "from-green-500/20 via-green-400/10 to-transparent border-green-400/30"
                : actionColor === "yellow"
                  ? "from-yellow-500/20 via-yellow-400/10 to-transparent border-yellow-400/30"
                  : "from-red-500/20 via-red-400/10 to-transparent border-red-400/30"
            }
            border shadow-2xl
          `}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-40">
              <div
                className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent ${
                  actionColor === "green"
                    ? "via-green-300/30"
                    : actionColor === "yellow"
                      ? "via-yellow-300/30"
                      : "via-red-300/30"
                } to-transparent`}
              ></div>
            </div>

            {/* Content */}
            <div className="relative px-4 py-2.5 flex items-center gap-3">
              {/* Animated Icon */}
              <div className="relative">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    actionColor === "green"
                      ? "bg-green-500/20 text-green-300"
                      : actionColor === "yellow"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                  }
                `}
                >
                  <ActionIcon className="w-4 h-4 animate-pulse" />
                </div>
                {/* Pulse Ring */}
                <span
                  className={`
                  absolute inset-0 rounded-full animate-ping
                  ${
                    actionColor === "green"
                      ? "bg-green-400/30"
                      : actionColor === "yellow"
                        ? "bg-yellow-400/30"
                        : "bg-red-400/30"
                  }
                `}
                ></span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`
                  text-sm font-semibold tracking-wide
                  ${
                    actionColor === "green"
                      ? "text-green-200"
                      : actionColor === "yellow"
                        ? "text-yellow-200"
                        : "text-red-200"
                  }
                `}
                >
                  {getActionText()}
                </p>
              </div>

              {/* Elapsed Time Badge */}
              <div
                className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full
                ${
                  actionColor === "green"
                    ? "bg-green-500/30 border border-green-300/40"
                    : actionColor === "yellow"
                      ? "bg-yellow-500/30 border border-yellow-300/40"
                      : "bg-red-500/30 border border-red-300/40"
                }
              `}
              >
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span
                  className={`
                  text-xs font-bold tabular-nums
                  ${
                    actionColor === "green"
                      ? "text-green-100"
                      : actionColor === "yellow"
                        ? "text-yellow-100"
                        : "text-red-100"
                  }
                `}
                >
                  {formatElapsedTime(realtimeElapsed)}
                </span>
              </div>
            </div>

            {/* Neon Glow Effect */}
            <div
              className={`
              absolute -inset-[1px] rounded-lg blur-sm -z-10 opacity-50
              ${
                actionColor === "green"
                  ? "bg-green-400/20"
                  : actionColor === "yellow"
                    ? "bg-yellow-400/20"
                    : "bg-red-400/20"
              }
            `}
            ></div>
          </div>
        </div>
      )}

      <div
        className={`hover:bg-white/5 active:bg-white/10 transition-colors duration-150 ${
          hasDetails ? "cursor-pointer" : ""
        } ${isExpanded ? "bg-white/5" : "bg-white/1"}`}
        onClick={handleExpandToggle}
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

      {isExpanded && hasDetails && (
        <div className="bg-slate-800/30 border-t border-white/10 px-3 md:px-8 py-4 md:py-6">
          <ResourceDetails
            resource={resource}
            onShowYaml={() => setShowYaml(true)}
          />

          {resource.type === RESOURCE_TYPES.DATABASE && (
            <div className="mt-4">
              <DatabaseInfo resource={resource} />
            </div>
          )}

          <div className="mt-4">
            <ComponentsList
              applications={resource.applications}
              databases={resource.databases}
            />
          </div>
        </div>
      )}

      {confirmUrl && (
        <Suspense fallback={null}>
          <ConfirmUrlModal
            url={confirmUrl}
            onClose={() => setConfirmUrl(null)}
          />
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
    </div>
  );
};

export default ResourceCard;
