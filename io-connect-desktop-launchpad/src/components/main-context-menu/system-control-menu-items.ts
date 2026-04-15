import { useCallback, useContext } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { ioDesktopUtils } from "@interopio/components-react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../../constants/constants";
import { MenuItemConfig } from "../../types";

export function useRestartMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { value: layoutsSaveCurrentOnExit = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAYOUTS_SAVE_CURRENT_ON_EXIT,
  });
  const { restartPlatform } = ioDesktopUtils;

  const handleRestart = useCallback(() => {
    void (async () => {
      try {
        await restartPlatform(io, layoutsSaveCurrentOnExit);
      } catch (error) {
        console.error("Failed to restart io.Connect Desktop", error);
      }
    })();
  }, [io, layoutsSaveCurrentOnExit]);

  return {
    label: "Restart",
    icon: "rotate-right",
    onClick: handleRestart,
  };
}

export function useShutdownMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { value: layoutsSaveCurrentOnExit = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAYOUTS_SAVE_CURRENT_ON_EXIT,
  });
  const { shutdownPlatform } = ioDesktopUtils;

  const handleShutdown = useCallback(() => {
    void (async () => {
      try {
        await shutdownPlatform(io, layoutsSaveCurrentOnExit);
      } catch (error) {
        console.error("Failed to shutdown io.Connect Desktop", error);
      }
    })();
  }, [io, layoutsSaveCurrentOnExit]);

  return {
    label: "Shut Down",
    icon: "power-off",
    onClick: handleShutdown,
  };
}
