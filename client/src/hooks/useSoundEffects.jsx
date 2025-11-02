/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import {
  playSoundType,
  getSoundEnabled,
  setSoundEnabled,
} from "../utils/soundUtils";

// Create Sound Context
const SoundContext = createContext(null);

/**
 * Sound Effects Provider Component
 * Wraps the app to provide sound functionality
 */
export const SoundProvider = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => getSoundEnabled());

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev;
      setSoundEnabled(newValue);
      return newValue;
    });
  }, []);

  // Play sound if enabled
  const playSound = useCallback(
    (soundType, volume = 0.3) => {
      if (isSoundEnabled) {
        playSoundType(soundType, volume);
      }
    },
    [isSoundEnabled]
  );

  const value = {
    isSoundEnabled,
    toggleSound,
    playSound,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};

/**
 * Custom hook to use sound effects
 * @returns {Object} - Sound context with isSoundEnabled, toggleSound, and playSound
 */
export const useSoundEffects = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundEffects must be used within a SoundProvider");
  }
  return context;
};
