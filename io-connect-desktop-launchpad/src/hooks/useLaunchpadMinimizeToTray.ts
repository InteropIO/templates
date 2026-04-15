import { usePlatformPref } from "@interopio/home-ui-react";
import { useMinimizeToTray } from "@interopio/components-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";

export function useLaunchpadMinimizeToTray() {
  const { value: shouldMinimizeToTray = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_MINIMIZE_TO_TRAY,
  });

  useMinimizeToTray({ shouldMinimizeToTray });
}

export default useLaunchpadMinimizeToTray;
