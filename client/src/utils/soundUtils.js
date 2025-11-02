/**
 * Sound Effects Utility
 * Manages audio playback for UI interactions
 */

// Sound file paths
export const SOUNDS = {
  CLICK: "/sounds/click.wav",
};

// Sound types for easy reference
export const SOUND_TYPES = {
  CLICK: "click",
};

/**
 * Play a sound effect
 * @param {string} soundPath - Path to the sound file
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const playSound = (soundPath, volume = 0.3) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch((error) => {
      console.warn("Sound playback failed:", error);
    });
  } catch (error) {
    console.warn("Error creating audio:", error);
  }
};

/**
 * Play a specific sound type
 * @param {string} type - Sound type from SOUND_TYPES
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const playSoundType = (type, volume = 0.3) => {
  const soundMap = {
    [SOUND_TYPES.CLICK]: SOUNDS.CLICK,
  };

  const soundPath = soundMap[type];
  if (soundPath) {
    playSound(soundPath, volume);
  }
};

/**
 * Get sound enabled state from localStorage
 * @returns {boolean} - Whether sound is enabled
 */
export const getSoundEnabled = () => {
  const stored = localStorage.getItem("soundEnabled");
  // Default to true (enabled)
  return stored === null ? true : stored === "true";
};

/**
 * Set sound enabled state in localStorage
 * @param {boolean} enabled - Whether sound should be enabled
 */
export const setSoundEnabled = (enabled) => {
  localStorage.setItem("soundEnabled", enabled.toString());
};
