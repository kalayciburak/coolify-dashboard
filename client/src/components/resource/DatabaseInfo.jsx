import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
  GlobeAltIcon,
  CpuChipIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { copyToClipboard } from "../../utils/clipboardUtils";
import { getDatabasePassword } from "../../utils/resourceUtils";

const DatabaseInfo = ({ resource }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showInternalUrl, setShowInternalUrl] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldName) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const password = getDatabasePassword(resource);

  return (
    <div className="space-y-4">
      {resource.internal_db_url && (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-2 cursor-help"
              data-tooltip-id="internal-url-tooltip"
              data-tooltip-content={t("tooltips.internalConnection")}
            >
              <LockClosedIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {t("resourceCard.internalConnectionAddress")}
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30">
              {t("resourceCard.veryImportant")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 bg-slate-800/50 px-3 py-2 rounded">
            <span className="flex-1 text-sm text-slate-300 font-mono break-all">
              {showInternalUrl
                ? resource.internal_db_url
                : "•••••••••••••••••••"}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInternalUrl(!showInternalUrl);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
              >
                {showInternalUrl ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(resource.internal_db_url, "internal_url");
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
              >
                {copiedField === "internal_url" ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {password && (
          <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">
                  {t("resourceCard.databasePassword")}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {t("resourceCard.critical")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 bg-slate-800/50 px-3 py-2 rounded">
              <span className="flex-1 text-sm text-slate-300 font-mono break-all">
                {showPassword ? password : "••••••••••••••••"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(password, "password");
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
                >
                  {copiedField === "password" ? (
                    <CheckIcon className="w-4 h-4 text-green-400" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`bg-slate-900/50 rounded-lg p-4 border ${
            resource.backup_configs && resource.backup_configs.length > 0
              ? "border-green-500/30"
              : "border-orange-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArchiveBoxIcon
                className={`w-5 h-5 ${
                  resource.backup_configs && resource.backup_configs.length > 0
                    ? "text-green-400"
                    : "text-orange-400"
                }`}
              />
              <span className="text-sm font-semibold text-white">
                {t("resourceCard.backup")}
              </span>
            </div>
            {(!resource.backup_configs ||
              resource.backup_configs.length === 0) && (
              <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                {t("resourceCard.warning")}
              </span>
            )}
          </div>
          {resource.backup_configs && resource.backup_configs.length > 0 ? (
            <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-300">
                {resource.backup_configs.length} aktif
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded cursor-help"
              data-tooltip-id="backup-tooltip"
              data-tooltip-content={t("tooltips.backupWarning")}
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-mono text-slate-300">
                {t("resourceCard.notConfigured")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <GlobeAltIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-white">
              {t("resourceCard.publicAccess")}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded">
            {resource.is_public ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300 font-mono">
                  {t("resourceCard.open")}
                </span>
                {resource.public_port && (
                  <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 font-mono ml-1">
                    Port: {resource.public_port}
                  </span>
                )}
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-300 font-mono">
                  {t("resourceCard.closed")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-white">
              {t("resourceCard.sslStatus")}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded">
            {resource.is_public_port_ssl_enabled ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-mono">
                  {t("resourceCard.active")}
                </span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-300 font-mono">
                  {t("resourceCard.passive")}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {(resource.limits_cpu ||
        resource.limits_memory ||
        resource.limits_cpus ||
        resource.limits_memory_swap ||
        resource.limits_memory_reservation ||
        resource.limits_cpuset) && (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <CpuChipIcon className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold text-white">
              {t("resourceCard.resourceLimits")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {resource.limits_cpus && (
              <div className="bg-slate-800/50 px-3 py-2 rounded">
                <p className="text-xs text-slate-400 mb-1">CPU Cores</p>
                <p className="text-sm text-white font-mono">
                  {resource.limits_cpus === "0"
                    ? t("status.unlimited")
                    : resource.limits_cpus}
                </p>
              </div>
            )}
            {resource.limits_cpu && (
              <div className="bg-slate-800/50 px-3 py-2 rounded">
                <p className="text-xs text-slate-400 mb-1">CPU Limit</p>
                <p className="text-sm text-white font-mono">
                  {resource.limits_cpu === "0"
                    ? t("status.unlimited")
                    : resource.limits_cpu}
                </p>
              </div>
            )}
            {resource.limits_cpuset && (
              <div className="bg-slate-800/50 px-3 py-2 rounded">
                <p className="text-xs text-slate-400 mb-1">CPU Set</p>
                <p className="text-sm text-white font-mono">
                  {resource.limits_cpuset}
                </p>
              </div>
            )}
            {resource.limits_memory && (
              <div className="bg-slate-800/50 px-3 py-2 rounded">
                <p className="text-xs text-slate-400 mb-1">
                  {t("resourceCard.memoryLimit")}
                </p>
                <p className="text-sm text-white font-mono">
                  {resource.limits_memory === "0"
                    ? t("status.unlimited")
                    : resource.limits_memory}
                </p>
              </div>
            )}
            {resource.limits_memory_swap && (
              <div className="bg-slate-800/50 px-3 py-2 rounded">
                <p className="text-xs text-slate-400 mb-1">
                  {t("resourceCard.swapLimit")}
                </p>
                <p className="text-sm text-white font-mono">
                  {resource.limits_memory_swap === "0" ||
                  resource.limits_memory_swap === "-1"
                    ? t("status.unlimited")
                    : resource.limits_memory_swap}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseInfo;
