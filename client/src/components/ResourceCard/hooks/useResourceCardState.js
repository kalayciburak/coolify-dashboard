import { useState, useEffect } from "react";
import { getUserType } from "../../../api/coolify";
import useResourceStore from "../../../store/resourceStore";

/**
 * useResourceCardState - Manages ResourceCard local state
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages card UI state (modals, timing, user)
 * - Interface Segregation: Returns clean, focused interface
 * - Dependency Inversion: Uses store abstraction
 *
 * Responsibilities:
 * - Modal visibility states
 * - User type fetching
 * - Action timing
 * - Expand/collapse state
 */
const useResourceCardState = (resource) => {
  // UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // User permissions
  const [userType, setUserType] = useState(null);

  // Action timing
  const [realtimeElapsed, setRealtimeElapsed] = useState(0);

  // Get action loading state from store
  const { actionLoading } = useResourceStore();
  const actionKey = `${resource.type}-${resource.uuid}`;
  const currentAction = actionLoading[actionKey];

  // Fetch user type on mount
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

  // Handle action timing updates
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

  // Sync with store elapsed time
  useEffect(() => {
    if (currentAction?.elapsedSeconds) {
      setRealtimeElapsed(currentAction.elapsedSeconds);
    }
  }, [currentAction?.elapsedSeconds]);

  return {
    // UI state
    isExpanded,
    setIsExpanded,

    // Modal states
    showYaml,
    setShowYaml,
    showLogs,
    setShowLogs,
    confirmUrl,
    setConfirmUrl,
    confirmAction,
    setConfirmAction,

    // User permissions
    userType,

    // Action state
    currentAction,
    realtimeElapsed,
  };
};

export default useResourceCardState;
