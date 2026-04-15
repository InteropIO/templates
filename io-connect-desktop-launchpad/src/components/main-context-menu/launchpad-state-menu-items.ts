import { useCallback, useContext } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { ioDesktopUtils, useWindowDocking } from "@interopio/components-react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { WINDOW_CONFIG, PLATFORM_PREFS_KEYS } from "../../constants/constants";
import { MenuItemConfig } from "../../types";

export function usePinLaunchpadMenuItem(): MenuItemConfig {
  const { value: isLaunchpadPinned = false, update: setIsLaunchpadPinned } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });

  const handlePinLaunchpad = useCallback(() => {
    void (async () => {
      try {
        await setIsLaunchpadPinned(!isLaunchpadPinned);
      } catch (error) {
        console.error("Failed to toggle Launchpad pin state", error);
      }
    })();
  }, [isLaunchpadPinned, setIsLaunchpadPinned]);

  return {
    label: `${isLaunchpadPinned ? "Unpin" : "Pin"} Launchpad`,
    icon: "pin",
    onClick: handlePinLaunchpad,
  };
}

export function useDockLaunchpadMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const myWindow = io?.windows?.my();
  const { dock, undock, dockingConfig } = useWindowDocking();

  const { value: isLaunchpadDocked = false, update: setIsLaunchpadDocked } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { value: isLaunchpadPinned = false, update: setIsLaunchpadPinned } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: launchpadAllowDocking = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_ALLOW_DOCKING,
  });
  const { value: launchpadDockedClaimsSpace = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_DOCKED_CLAIMS_SPACE,
  });

  const handleDockLaunchpad = useCallback(() => {
    void (async () => {
      try {
        // If we don't have a window or docking API, just flip the pref.
        if (!myWindow || !dockingConfig) {
          await setIsLaunchpadDocked(!isLaunchpadDocked);
          return;
        }

        if (isLaunchpadDocked) {
          // Undock: restore previous bounds if saved
          await undock({ restoreBounds: true });
          await setIsLaunchpadDocked(false);
        } else {
          // If currently pinned, unpin first and clear its placement
          if (isLaunchpadPinned && myWindow) {
            await setIsLaunchpadPinned(false);
            await new Promise((resolve) => setTimeout(resolve, 100));

            await myWindow.clearPlacement({ restoreBounds: true });
            await myWindow.configure({
              hasMoveAreas: true,
              hasSizeAreas: true,
            });

            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          await dock({
            position: "top",
            claimScreenArea: launchpadDockedClaimsSpace,
            height: WINDOW_CONFIG.DOCKED.HEIGHT,
            saveBounds: true,
          });
          await setIsLaunchpadDocked(true);
        }
      } catch (error) {
        console.error("Failed to toggle Launchpad docked state", error);
      }
    })();
  }, [
    myWindow,
    dockingConfig,
    isLaunchpadDocked,
    isLaunchpadPinned,
    dock,
    undock,
    setIsLaunchpadDocked,
    setIsLaunchpadPinned,
  ]);

  return {
    label: `${isLaunchpadDocked ? "Undock" : "Dock"} Launchpad`,
    icon: "up-to-line",
    onClick: handleDockLaunchpad,
    disabled: !launchpadAllowDocking,
  };
}

export function useMinimizeMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const { value: isLaunchpadPinned = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { minimizeWindow } = ioDesktopUtils;

  const handleMinimize = useCallback(() => {
    void (async () => {
      try {
        await minimizeWindow(io);
      } catch (error) {
        console.error("Failed to minimize window", error);
      }
    })();
  }, [io]);

  return {
    label: "Minimize",
    icon: "minimize-down",
    onClick: handleMinimize,
    disabled: isLaunchpadPinned || isLaunchpadDocked,
  };
}
