import { useTranslation } from "react-i18next";
import { PlayIcon, StopIcon, TrashIcon } from "@heroicons/react/24/outline";

/**
 * useResourceActions - Action-related utilities for ResourceCard
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles action UI logic (color, icon, text)
 * - Open/Closed: New action types can be added via switch cases
 * - Interface Segregation: Returns focused action utilities
 *
 * Responsibilities:
 * - Action color mapping
 * - Action icon mapping
 * - Action text translation
 * - Time formatting
 */
const useResourceActions = (currentAction) => {
  const { t, i18n } = useTranslation();

  /**
   * Get color for current action
   * @returns {string|null} Color name (green, yellow, red) or null
   */
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

  /**
   * Get icon component for current action
   * @returns {Component|null} Icon component or null
   */
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

  /**
   * Get translated action text
   * @returns {string} Translated action text
   */
  const getActionText = () => {
    if (!currentAction) return "";
    return t(`admin.${currentAction.action}`);
  };

  /**
   * Format elapsed time (seconds → "Xs" or "Xm Ys")
   * @param {number} seconds - Elapsed seconds
   * @returns {string} Formatted time string
   */
  const formatElapsedTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minuteUnit = i18n.language === "tr" ? "d" : "m";
    return `${minutes}${minuteUnit} ${remainingSeconds}s`;
  };

  return {
    actionColor: getActionColor(),
    ActionIcon: getActionIcon(),
    actionText: getActionText(),
    formatElapsedTime,
  };
};

export default useResourceActions;
