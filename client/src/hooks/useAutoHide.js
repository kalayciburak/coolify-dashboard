import { useEffect } from "react";

/**
 * useAutoHide - Custom hook for auto-hiding state after timeout
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles auto-hide timing logic
 * - Open/Closed: Reusable for any state that needs auto-hide
 * - DRY: Eliminates duplicated useEffect patterns
 *
 * Usage:
 * const [visible, setVisible] = useState(false);
 * useAutoHide(visible, setVisible, 10000); // Auto-hide after 10s
 *
 * Replaces 3 identical useEffect blocks in DatabaseInfo.jsx (lines 38-63)
 */
const useAutoHide = (state, setState, timeout = 10000) => {
  useEffect(() => {
    if (!state) return;

    const timer = setTimeout(() => {
      setState(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [state, setState, timeout]);
};

export default useAutoHide;
