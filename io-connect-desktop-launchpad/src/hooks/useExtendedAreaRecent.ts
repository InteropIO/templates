import { usePlatformPref } from "@interopio/home-ui-react";
import { useMemo } from "react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";

export interface UseExtendedAreaRecentResult {
  items: Array<{ type: string; name: string }>;
  shouldShow: boolean;
  isLoading: boolean;
}

export function useExtendedAreaRecent(): UseExtendedAreaRecentResult {
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { value: recentInPrefs = [], isLoading } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.RECENT,
  });
  const { value: shouldShowRecent = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_SHOW_RECENT_APPS_IN_EXTENDED_AREA,
  });

  // Extended area is only visible when docked - skip processing if not docked
  if (!isLaunchpadDocked) {
    return {
      items: [],
      shouldShow: false,
      isLoading: false,
    };
  }

  const recentToShow = useMemo(() => {
    return (recentInPrefs ?? []) as unknown as Array<{ type: string; name: string }>;
  }, [recentInPrefs]);

  return {
    items: recentToShow,
    shouldShow: shouldShowRecent && recentToShow.length > 0,
    isLoading,
  };
}

export default useExtendedAreaRecent;
