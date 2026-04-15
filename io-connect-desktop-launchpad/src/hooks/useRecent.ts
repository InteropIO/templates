import { useContext, useEffect, useRef, useCallback } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectWorkspaces } from "@interopio/workspaces-api";
import { usePlatformPref } from "@interopio/home-ui-react";
import { CATEGORY_ITEM_TYPES, MAX_RECENT_ITEMS, PLATFORM_PREFS_KEYS } from "../constants/constants";
import { RecentItem, CompositionChangedEventBase, CreatedEventBase } from "../types";

export function useRecent() {
  const io = useContext(IOConnectContext) as unknown as IOConnectDesktop.API;
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { update: updateRecent } = usePlatformPref({ prefKey: PLATFORM_PREFS_KEYS.RECENT });
  const updateRecentRef = useRef(updateRecent);

  // Track which app names have already been recorded as standalone to avoid noisy re-adds.
  const recordedStandaloneAppsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    updateRecentRef.current = updateRecent;
  }, [updateRecent]);

  const addToRecent = useCallback((appName: string) => {
    if (!updateRecentRef.current) {
      return;
    }

    updateRecentRef.current((currentRecent) => {
      const current = (currentRecent || []) as unknown as RecentItem[];

      return [
        { type: CATEGORY_ITEM_TYPES.APPLICATION, name: appName },
        ...current.filter((item) => item.name !== appName),
      ].slice(0, MAX_RECENT_ITEMS) as unknown as typeof currentRecent;
    });
  }, []);

  useEffect(() => {
    // Recent tracking is only needed when extended area is visible (docked mode)
    if (!io || !isLaunchpadDocked) {
      return;
    }

    const unsubscribeArr: (IOConnectWorkspaces.Unsubscribe | undefined)[] = [];

    const unsubscribeCompositionChanged = io.windows.onEvent((event) => {
      if (event.type !== "CompositionChanged") {
        return;
      }

      const compositionEvent = event as unknown as CompositionChangedEventBase;
      const appName = compositionEvent.windowName;
      const windowState = compositionEvent.data?.windowState ?? null;

      // Guard & filtering of special / hidden / autostart apps.
      if (!appName || appName === "workspaces-demo") {
        return;
      }

      const application = io.appManager.applications().find((a) => a.name === appName);

      if (!application || application.hidden || application.autoStart) {
        return;
      }

      // Standalone app: windowState reported as null.
      const isStandalone = windowState === null;

      if (!isStandalone) {
        return;
      }

      // Always add/update position in recent list
      addToRecent(appName);
      recordedStandaloneAppsRef.current.add(appName);
    });

    unsubscribeArr.push(unsubscribeCompositionChanged);

    const unsubscribeCreated = io.windows.onEvent((event) => {
      if (event.type !== "Created") {
        return;
      }

      const createdEvent = event as unknown as CreatedEventBase;
      const appName = createdEvent.data?.applicationName;
      const isHidden = createdEvent.data?.hidden ?? false;

      // Guard & filtering of special / hidden / autostart apps.
      if (!appName || appName === "workspaces-demo" || isHidden) {
        return;
      }

      const application = io.appManager.applications().find((a) => a.name === appName);

      if (!application || application.hidden || application.autoStart) {
        return;
      }

      const isFrameless = createdEvent.data?.mode === "frameless";

      if (!isFrameless) {
        return;
      }

      // Always add/update position in recent list for frameless apps
      addToRecent(appName);
      recordedStandaloneAppsRef.current.add(appName);
    });

    unsubscribeArr.push(unsubscribeCreated);

    (async () => {
      try {
        const unsubscribeOnWorkspaceOpened = await io.workspaces?.onWorkspaceOpened((workspace) => {
          if (workspace.children.length === 0) {
            return;
          }

          if (updateRecentRef.current) {
            updateRecentRef.current((currentRecent) => {
              const current = (currentRecent || []) as unknown as RecentItem[];

              return [
                { type: CATEGORY_ITEM_TYPES.WORKSPACE, name: workspace.title },
                ...current.filter((item) => item.name !== workspace.title),
              ].slice(0, MAX_RECENT_ITEMS) as unknown as typeof currentRecent;
            });
          }
        });
        unsubscribeArr.push(unsubscribeOnWorkspaceOpened);
      } catch (error) {
        console.error("Error subscribing to workspace opened events:", error);
      }
    })();

    return () => {
      for (const unsubscribe of unsubscribeArr) {
        unsubscribe?.();
      }
    };
  }, [io, isLaunchpadDocked, addToRecent]);
}
