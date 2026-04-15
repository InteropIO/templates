import { useContext, useEffect, useRef } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { useWindowDocking } from "@interopio/components-react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { WINDOW_CONFIG, PLATFORM_PREFS_KEYS } from "../constants/constants";

export type DockingPosition = "top";

export function useLaunchpadDocking() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const myWindow = io?.windows?.my();
  const { loading, dockingConfig, setDockingConfig } = useWindowDocking();

  const isInitializedRef = useRef(false);
  const lastKnownDockedRef = useRef<boolean | undefined>(undefined);
  const lastKnownAllowDockingRef = useRef<boolean | undefined>(undefined);
  const lastAppliedClaimSpaceRef = useRef<boolean | undefined>(undefined);

  const { value: isLaunchpadDocked = false, update: updateIsLaunchpadDocked } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { value: launchpadAllowDocking = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_ALLOW_DOCKING,
  });
  const { value: launchpadDockedAlwaysOnTop = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_DOCKED_ALWAYS_ON_TOP,
  });
  const { value: launchpadDockedClaimsSpace = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_DOCKED_CLAIMS_SPACE,
  });
  const { value: isLaunchpadCollapsed = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_COLLAPSED,
  });

  useEffect(() => {
    if (!io || !myWindow || loading || !dockingConfig) {
      return;
    }

    const shouldInit = !isInitializedRef.current;
    const allowDockingChanged = lastKnownAllowDockingRef.current !== launchpadAllowDocking;
    const claimSpaceChanged = lastAppliedClaimSpaceRef.current !== launchpadDockedClaimsSpace;

    // Only call setDockingConfig once per actual change in prefs
    if (!shouldInit && !allowDockingChanged && !claimSpaceChanged) {
      return;
    }

    const initAndSync = async () => {
      isInitializedRef.current = true;
      lastKnownAllowDockingRef.current = launchpadAllowDocking;
      lastAppliedClaimSpaceRef.current = launchpadDockedClaimsSpace;

      await setDockingConfig({
        enabled: launchpadAllowDocking,
        allowedPositions: ["top"] as DockingPosition[],
        claimScreenArea: launchpadDockedClaimsSpace,
        height: WINDOW_CONFIG.DOCKED.HEIGHT,
      });

      // After initialization, sync pref with platform state (platform is source of truth after crash)
      if (
        shouldInit &&
        typeof dockingConfig.docked === "boolean" &&
        dockingConfig.docked !== isLaunchpadDocked
      ) {
        lastKnownDockedRef.current = dockingConfig.docked;
        await updateIsLaunchpadDocked(dockingConfig.docked);
      }
    };

    void initAndSync();
  }, [
    io,
    myWindow,
    loading,
    dockingConfig,
    launchpadAllowDocking,
    launchpadDockedClaimsSpace,
    setDockingConfig,
    isLaunchpadDocked,
    updateIsLaunchpadDocked,
  ]);

  useEffect(() => {
    if (loading || !dockingConfig || !isInitializedRef.current) {
      return;
    }

    const dockedChanged =
      typeof dockingConfig.docked === "boolean" &&
      dockingConfig.docked !== lastKnownDockedRef.current;

    if (!dockedChanged) {
      return;
    }

    const syncState = async () => {
      try {
        if (dockedChanged && typeof dockingConfig.docked === "boolean") {
          // API is the source of truth here: bring both ref and pref in sync
          lastKnownDockedRef.current = dockingConfig.docked;
          await updateIsLaunchpadDocked(dockingConfig.docked);

          // If undocking while collapsed, restore to collapsed height
          if (!dockingConfig.docked && isLaunchpadCollapsed && myWindow) {
            await myWindow.configure({ hasSizeAreas: !isLaunchpadCollapsed });
            await myWindow.setSizeConstraints({
              minHeight: isLaunchpadCollapsed
                ? WINDOW_CONFIG.COLLAPSED.HEIGHT
                : WINDOW_CONFIG.EXPANDED.MIN_HEIGHT,
            });
            await myWindow.moveResize({ height: WINDOW_CONFIG.COLLAPSED.HEIGHT });
          }
        }
      } catch (error) {
        console.error("Failed to sync docking state from API:", error);
      }
    };

    void syncState();
  }, [myWindow, updateIsLaunchpadDocked, isLaunchpadCollapsed, dockingConfig?.docked, loading]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      return;
    }

    if (!launchpadAllowDocking && isLaunchpadDocked) {
      void updateIsLaunchpadDocked(false);
    }
  }, [launchpadAllowDocking, isLaunchpadDocked, updateIsLaunchpadDocked]);

  useEffect(() => {
    if (!io || !myWindow || loading || !dockingConfig?.docked) {
      return;
    }

    const applyAlwaysOnTop = async () => {
      try {
        await myWindow.setOnTop(launchpadDockedAlwaysOnTop);
      } catch (error) {
        console.error("Failed to apply alwaysOnTop:", error);
      }
    };

    void applyAlwaysOnTop();
  }, [io, myWindow, loading, dockingConfig?.docked, launchpadDockedAlwaysOnTop]);
}
