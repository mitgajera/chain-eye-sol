
/**
 * Theme Manager to handle application-wide theme settings
 */

/**
 * Initialize theme settings from localStorage
 * This should be called on app startup
 */
export function initializeTheme(): void {
  const savedSettings = localStorage.getItem('appSettings');
  
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      if (parsedSettings.general.darkMode) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    } catch (err) {
      console.error("Error parsing saved theme settings:", err);
      // Default to dark mode if error
      enableDarkMode();
    }
  } else {
    // Default to dark mode if no settings found
    enableDarkMode();
  }
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode(): void {
  if (document.documentElement.classList.contains('dark')) {
    disableDarkMode();
    updateSettings(false);
  } else {
    enableDarkMode();
    updateSettings(true);
  }
}

/**
 * Enable dark mode
 */
export function enableDarkMode(): void {
  document.documentElement.classList.add('dark');
}

/**
 * Disable dark mode
 */
export function disableDarkMode(): void {
  document.documentElement.classList.remove('dark');
}

/**
 * Update dark mode setting in localStorage
 */
function updateSettings(isDarkMode: boolean): void {
  const savedSettings = localStorage.getItem('appSettings');
  
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      parsedSettings.general.darkMode = isDarkMode;
      localStorage.setItem('appSettings', JSON.stringify(parsedSettings));
    } catch (err) {
      console.error("Error updating theme settings:", err);
    }
  } else {
    // Create new settings if none exist
    const defaultSettings = {
      general: {
        refreshInterval: 60,
        darkMode: isDarkMode,
        notifications: true,
      },
      api: {
        heliusKey: "",
      },
      display: {
        showLabels: true,
        animateTransactions: true,
        highContrast: false,
      }
    };
    
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  }
}
