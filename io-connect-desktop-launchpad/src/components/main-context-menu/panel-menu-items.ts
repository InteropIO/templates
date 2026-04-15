import { useCallback } from "react";
import { IconProps } from "@interopio/components-react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../../constants/constants";
import { usePanelPopupContext, type PanelType } from "../../contexts/panel-popup-provider";
import { MenuItemConfig } from "../../types";

interface PanelMenuItemOptions {
  panelId: PanelType;
  label: string;
  icon: IconProps["variant"];
}

export function usePanelMenuItem({ panelId, label, icon }: PanelMenuItemOptions): MenuItemConfig {
  const { openPanel } = usePanelPopupContext();
  const { value: isLaunchpadCollapsed = false, update: setIsLaunchpadCollapsed } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_COLLAPSED,
  });
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  const handleOpenPanel = useCallback(async () => {
    // If we're collapsed while undocked, expand first so the panel content is visible
    if (!isLaunchpadDocked && isLaunchpadCollapsed) {
      try {
        await setIsLaunchpadCollapsed(false);
      } catch (error) {
        console.error("Failed to uncollapse Launchpad before opening panel", error);
      }
    }

    openPanel(panelId);
  }, [isLaunchpadDocked, isLaunchpadCollapsed, setIsLaunchpadCollapsed, openPanel, panelId]);

  return {
    label,
    icon,
    onClick: () => void handleOpenPanel(),
  };
}

export function usePreferencesMenuItem(): MenuItemConfig {
  return usePanelMenuItem({
    panelId: "preferences",
    label: "Platform Preferences",
    icon: "cog",
  });
}

export function useNotificationSettingsMenuItem(): MenuItemConfig {
  return usePanelMenuItem({
    panelId: "notification-settings",
    label: "Notification Settings",
    icon: "bell",
  });
}

export function useProfileMenuItem(): MenuItemConfig {
  return usePanelMenuItem({
    panelId: "profile",
    label: "Profile",
    icon: "user",
  });
}
