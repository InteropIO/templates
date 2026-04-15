import { useEffect, useContext, useRef } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { usePlatformPref } from "@interopio/home-ui-react";
import { WINDOW_CONFIG, PLATFORM_PREFS_KEYS } from "../constants/constants";

export type HorizontalAlignment = "left" | "right";

export function useLaunchpadPinning() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const myWindow = io?.windows?.my();
  const lastPinnedRef = useRef<boolean | undefined>(undefined);
  const wasCollapsedWhenPinnedRef = useRef<boolean>(false);

  const { value: isLaunchpadPinned = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: launchpadPinnedPosition = "Left" } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_PINNED_POSITION,
  });
  const { value: isLaunchpadDocked = false, update: updateIsLaunchpadDocked } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { value: isLaunchpadCollapsed = false, update: updateIsLaunchpadCollapsed } =
    usePlatformPref({
      prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_COLLAPSED,
    });

  useEffect(() => {
    if (!myWindow) {
      return;
    }

    const prevPinned = lastPinnedRef.current;
    const pinnedChanged = prevPinned !== isLaunchpadPinned;

    lastPinnedRef.current = isLaunchpadPinned;

    if (!pinnedChanged) {
      return;
    }

    const handlePinTransition = async () => {
      try {
        if (isLaunchpadPinned) {
          // Remember if we were collapsed when pinning
          wasCollapsedWhenPinnedRef.current = isLaunchpadCollapsed;

          // Leaving docked/collapsed states to enter a clean pinned state.
          if (isLaunchpadDocked) {
            await updateIsLaunchpadDocked(false);
          }

          await myWindow.configure({ hasMoveAreas: false, hasSizeAreas: false });

          // Place using current pinned position.
          const horizontalAlignment: HorizontalAlignment =
            launchpadPinnedPosition === "Left" ? "left" : "right";
          const placementBase = {
            top: WINDOW_CONFIG.MARGIN,
            bottom: WINDOW_CONFIG.MARGIN,
            width: WINDOW_CONFIG.PINNED.WIDTH,
            snapped: true,
            display: "current" as const,
            horizontalAlignment,
            saveBounds: true,
          };
          const sideOffset =
            horizontalAlignment === "left"
              ? { left: WINDOW_CONFIG.MARGIN }
              : { right: WINDOW_CONFIG.MARGIN };

          await myWindow.place({ ...placementBase, ...sideOffset });
        } else {
          // Unpin: restore interactivity and, if we were collapsed when pinned,
          // restore the collapsed state so useLaunchpadCollapse can reapply height.
          await myWindow.configure({ hasMoveAreas: true, hasSizeAreas: true });
          await myWindow.clearPlacement({ restoreBounds: true });

          if (wasCollapsedWhenPinnedRef.current) {
            await updateIsLaunchpadCollapsed(true);
            wasCollapsedWhenPinnedRef.current = false;
          }
        }
      } catch (error) {
        console.error("Failed during pin transition", error);
      }
    };

    void handlePinTransition();
  }, [
    myWindow,
    isLaunchpadPinned,
    isLaunchpadDocked,
    isLaunchpadCollapsed,
    launchpadPinnedPosition,
    updateIsLaunchpadDocked,
    updateIsLaunchpadCollapsed,
  ]);

  useEffect(() => {
    if (!myWindow || !isLaunchpadPinned) {
      return;
    }

    const repositionIfPinned = async () => {
      try {
        const horizontalAlignment: HorizontalAlignment =
          launchpadPinnedPosition === "Left" ? "left" : "right";
        const placementBase = {
          top: WINDOW_CONFIG.MARGIN,
          bottom: WINDOW_CONFIG.MARGIN,
          width: WINDOW_CONFIG.PINNED.WIDTH,
          snapped: true,
          display: "current" as const,
          horizontalAlignment,
          saveBounds: true,
        };
        const sideOffset =
          horizontalAlignment === "left"
            ? { left: WINDOW_CONFIG.MARGIN }
            : { right: WINDOW_CONFIG.MARGIN };

        await myWindow.place({ ...placementBase, ...sideOffset });
      } catch (error) {
        console.error("Failed to reposition pinned window", error);
      }
    };
    void repositionIfPinned();
  }, [myWindow, isLaunchpadPinned, launchpadPinnedPosition]);
}
