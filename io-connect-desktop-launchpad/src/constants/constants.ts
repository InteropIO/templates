import IODesktop from "@interopio/desktop";
import IOSearch from "@interopio/search-api";
import IOWorkspaces from "@interopio/workspaces-api";
import IOModalsAPI from "@interopio/modals-api";
import { IOConnectInitSettings } from "@interopio/react-hooks";

export const ioConfig = {
  desktop: {
    factory: IODesktop,
    config: {
      gateway: {
        logging: {
          level: "warn",
        },
      },
      libraries: [IOWorkspaces, IOSearch, IOModalsAPI],
      appManager: "full",
      layouts: "full",
      activities: "trackAll",
      channels: false,
      metrics: false,
      contexts: true,
      systemLogger: {
        level: "warn",
      },
    },
  },
} as IOConnectInitSettings;

export const WINDOW_CONFIG = {
  MARGIN: 0,
  PINNED: {
    WIDTH: 400,
  },
  DOCKED: {
    HEIGHT: 48,
    BODY_WIDTH: 400,
    BODY_HEIGHT: 700,
  },
  COLLAPSED: {
    HEIGHT: 48,
  },
  EXPANDED: {
    MIN_WIDTH: 400,
    MAX_WIDTH: 400,
    MIN_HEIGHT: 480,
    HEIGHT: 800,
  },
  MAIN_CONTEXT_MENU: {
    WIDTH: 260,
    HEIGHT: 360,
  },
};

export const PLATFORM_UTILITY_PAGES = {
  ABOUT: "about",
  HOTKEYS: "hotkeys",
  FEEDBACK: "feedback",
} as const;

export const PLATFORM_APPS = {
  DOWNLOAD_MANAGER: "io-connect-download-manager",
  GETTING_STARTED: "getting-started",
} as const;

export const MAX_RECENT_ITEMS = 5;

export const CATEGORY_ITEM_TYPES = {
  APPLICATION: "application",
  WORKSPACE: "workspace",
} as const;

export const PLATFORM_PREFS_KEYS = {
  CUSTOM_PREFS: "customPrefs",
  COLLAPSED_SECTIONS: "_launchpad_collapsedSections",
  FAVORITES: "_launchpad_favorites",
  RECENT: "_launchpad_recent",
  IS_LAYOUTS_PANEL_OPEN: "_launchpad_isLayoutsPanelOpen",
  IS_LAUNCHPAD_COLLAPSED: "_launchpad_isCollapsed",
  IS_LAUNCHPAD_PINNED: "_launchpad_isPinned",
  IS_LAUNCHPAD_DOCKED: "_launchpad_isDocked",
  LAUNCHPAD_MINIMIZE_TO_TRAY: "_launchpad_minimizeToTray",
  LAUNCHPAD_AUTO_CLOSE: "_launchpad_autoCloseStartingAppsAndWorkspaces",
  LAUNCHPAD_PINNED_POSITION: "_launchpad_pinnedPosition",
  LAUNCHPAD_ALLOW_DOCKING: "_launchpad_allowDocking",
  LAUNCHPAD_DOCKED_ALWAYS_ON_TOP: "_launchpad_dockedAlwaysOnTop",
  LAUNCHPAD_DOCKED_CLAIMS_SPACE: "_launchpad_dockedClaimsSpace",
  LAUNCHPAD_SHOW_EXTENDED_AREA: "_launchpad_showExtendedArea",
  LAUNCHPAD_HIDE_LABELS_IN_EXTENDED_AREA: "_launchpad_hideLabelsInExtendedArea",
  LAUNCHPAD_SHOW_FAVORITES_IN_EXTENDED_AREA: "_launchpad_showFavoritesInExtendedArea",
  LAUNCHPAD_HIDE_FAVORITES_SECTION: "_launchpad_hideFavoritesSection",
  LAUNCHPAD_SHOW_RECENT_APPS_IN_EXTENDED_AREA: "_launchpad_showRecentAppsInExtendedArea",
  LAYOUTS_RESTORE_LAST_SAVED: "_layouts_restoreLastSaved",
  LAYOUTS_SAVE_CURRENT_ON_EXIT: "_layouts_saveCurrentOnExit",
  LAYOUTS_SHOW_UNSAVED_CHANGES_PROMPT: "_layouts_showUnsavedChangesPrompt",
  LAYOUTS_SHOW_DELETE_PROMPT: "_layouts_showDeletePrompt",
  DOWNLOADS_ASK_FOR_EACH_DOWNLOAD: "_downloads_askForEachDownload",
  DOWNLOADS_LOCATION: "_downloads_location",
  SYSTEM_SCHEDULE_RESTART: "_system_scheduleRestart",
  SYSTEM_SCHEDULE_RESTART_TIME: "_system_scheduleRestartTime",
  SYSTEM_SCHEDULE_RESTART_FREQUENCY: "_system_scheduleRestartFrequency",
  SYSTEM_SCHEDULE_RESTART_DAY: "_system_scheduleRestartDay",
  SYSTEM_SCHEDULE_SHUTDOWN: "_system_scheduleShutdown",
  SYSTEM_SCHEDULE_SHUTDOWN_TIME: "_system_scheduleShutdownTime",
  SYSTEM_SCHEDULE_SHUTDOWN_FREQUENCY: "_system_scheduleShutdownFrequency",
  SYSTEM_SCHEDULE_SHUTDOWN_DAY: "_system_scheduleShutdownDay",
} as const;

export const MODIFIER_KEYS = {
  CONTROL: "Control",
  SHIFT: "Shift",
} as const;

export const HOME_ALERT_VARIANTS = {
  SUCCESS: "success",
  WARNING: "warning",
} as const;

export const HOME_ALERT_TTL = {
  success: 5 * 1000,
  warning: 10 * 1000,
} as const;
