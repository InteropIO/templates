import { useFavorites, usePlatformPref } from "@interopio/home-ui-react";
import { useMemo } from "react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";

export interface UseExtendedAreaFavoritesResult {
  items: Array<{ type: string; name: string }>;
  shouldShow: boolean;
  isLoading: boolean;
}

export function useExtendedAreaFavorites(): UseExtendedAreaFavoritesResult {
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { favorites = [], isLoading } = useFavorites();
  const { value: shouldShowFavorites = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_SHOW_FAVORITES_IN_EXTENDED_AREA,
  });

  // Extended area is only visible when docked - skip processing if not docked
  if (!isLaunchpadDocked) {
    return {
      items: [],
      shouldShow: false,
      isLoading: false,
    };
  }

  // Transform favorites to minimal item references
  const minimalItems = useMemo(() => {
    return favorites.map((fav) => ({
      type: fav.type,
      name: fav.id, // Use id as name for apps/workspaces
    }));
  }, [favorites]);

  return {
    items: minimalItems,
    shouldShow: shouldShowFavorites && minimalItems.length > 0,
    isLoading,
  };
}

export default useExtendedAreaFavorites;
