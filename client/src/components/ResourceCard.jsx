import { useState, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  ServerIcon,
  CubeIcon,
  CircleStackIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
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
import { getUserType } from "../api/coolify";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { SOUND_TYPES } from "../utils/soundUtils";

const ConfirmUrlModal = lazy(() => import("./modals/ConfirmUrlModal"));
const YamlModal = lazy(() => import("./modals/YamlModal"));
const LogsModal = lazy(() => import("./modals/LogsModal"));
const ConfirmActionModal = lazy(() => import("./modals/ConfirmActionModal"));

const ResourceCard = ({ resource }) => {
  const { t, i18n } = useTranslation();
  const { playSound } = useSoundEffects();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [realtimeElapsed, setRealtimeElapsed] = useState(0);
  const [userType, setUserType] = useState(null);

  const {
    actionLoading,
    startResourceAction,
    stopResourceAction,
    deleteResourceAction,
  } = useResourceStore();
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

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const type = await getUserType();
        setUserType(type);
      } catch (error) {
        console.error("Failed to fetch user type:", error);
      }
    };
    fetchUserType();
  }, []);

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
      playSound(SOUND_TYPES.CLICK);
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

      {isExpanded && hasDetails && (
        <div className="bg-slate-800/30 border-t border-white/10 px-3 md:px-8 py-4 md:py-6">
          <ResourceDetails resource={resource} />

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

      {/* Card Actions Footer */}
      <div className="border-t border-white/10 bg-slate-800/20 px-3 md:px-6 py-3 md:py-4">
        <div className="flex flex-row flex-wrap items-center justify-between gap-3">
          {/* Left Side: Go to App & View YAML */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:pl-6">
            {/* Go to App Button */}
            {urls.length > 0 && resourceTypeId !== "database" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(SOUND_TYPES.CLICK);
                  setConfirmUrl(urls[0]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 hover:text-indigo-100 rounded-lg border border-indigo-500/40 transition text-sm font-medium cursor-pointer"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                <span className="hidden md:inline">
                  {t("resourceCard.goToApp")}
                </span>
              </button>
            )}

            {/* View YAML Button */}
            {(resource.docker_compose || resource.docker_compose_raw) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(SOUND_TYPES.CLICK);
                  setShowYaml(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 hover:text-indigo-100 rounded-lg border border-indigo-500/40 transition text-sm font-medium cursor-pointer"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span className="hidden md:inline">
                  {t("resourceCard.viewYaml")}
                </span>
              </button>
            )}
          </div>

          {/* Right Side: Admin Controls */}
          {userType === "admin" && (
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:pr-6">
              {/* Action Status Indicator - Shows when action is in progress */}
              {currentAction && ActionIcon ? (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    actionColor === "green"
                      ? "bg-green-500/20 border-green-500/40 text-green-200"
                      : actionColor === "yellow"
                        ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-200"
                        : "bg-red-500/20 border-red-500/40 text-red-200"
                  }`}
                >
                  <ActionIcon className="w-4 h-4 animate-pulse flex-shrink-0" />
                  <span className="text-sm font-medium hidden md:inline">
                    {getActionText()}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 animate-spin"
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
                    <span className="text-xs font-bold tabular-nums">
                      {formatElapsedTime(realtimeElapsed)}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Start Button */}
                  {resource.status &&
                    ["exited", "stopped", "dead"].includes(
                      resource.status.toLowerCase().split(":")[0]
                    ) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound(SOUND_TYPES.CLICK);
                          setConfirmAction("start");
                        }}
                        disabled={!!currentAction}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/40 disabled:bg-green-500/10 text-green-200 disabled:text-green-400 rounded-lg border border-green-500/40 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <PlayIcon className="w-4 h-4" />
                        <span className="hidden md:inline">
                          {t("admin.start")}
                        </span>
                      </button>
                    )}

                  {/* Stop Button */}
                  {resource.status &&
                    resource.status.toLowerCase().split(":")[0] ===
                      "running" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound(SOUND_TYPES.CLICK);
                          setConfirmAction("stop");
                        }}
                        disabled={!!currentAction}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 disabled:bg-yellow-500/10 text-yellow-200 disabled:text-yellow-400 rounded-lg border border-yellow-500/40 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <StopIcon className="w-4 h-4" />
                        <span className="hidden md:inline">
                          {t("admin.stop")}
                        </span>
                      </button>
                    )}

                  {/* View Logs Button - Only for Applications */}
                  {resource.type === RESOURCE_TYPES.APPLICATION && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(SOUND_TYPES.CLICK);
                        setShowLogs(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 hover:text-blue-100 rounded-lg border border-blue-500/40 transition text-sm font-medium cursor-pointer"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      <span className="hidden md:inline">
                        {t("admin.viewLogs")}
                      </span>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound(SOUND_TYPES.CLICK);
                      setConfirmAction("delete");
                    }}
                    disabled={!!currentAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 disabled:bg-red-500/10 text-red-200 disabled:text-red-400 rounded-lg border border-red-500/40 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="hidden md:inline">
                      {t("admin.delete")}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
            onConfirm={() => {
              if (confirmAction === "start") {
                startResourceAction(resource.type, resource.uuid, t);
              } else if (confirmAction === "stop") {
                stopResourceAction(resource.type, resource.uuid, t);
              } else if (confirmAction === "delete") {
                deleteResourceAction(resource.type, resource.uuid, t);
              }
              setConfirmAction(null);
            }}
            onClose={() => setConfirmAction(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ResourceCard;
