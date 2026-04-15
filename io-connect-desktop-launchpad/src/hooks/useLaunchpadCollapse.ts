import { useContext, useEffect, useRef } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { usePlatformPref } from "@interopio/home-ui-react";
import { WINDOW_CONFIG, PLATFORM_PREFS_KEYS } from "../constants/constants";

const LAST_EXPANDED_HEIGHT_KEY = "launchpad:lastExpandedHeight";

function getStoredExpandedHeight(minHeight: number): number {
  try {
    const raw = globalThis.localStorage?.getItem(LAST_EXPANDED_HEIGHT_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;

    return parsed >= minHeight ? parsed : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

function persistExpandedHeight(height: number) {
  try {
    globalThis.localStorage?.setItem(LAST_EXPANDED_HEIGHT_KEY, String(height));
  } catch {
    // Ignore storage failures.
  }
}

export function useLaunchpadCollapse() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const prevCollapsedRef = useRef<boolean | undefined>(undefined);

  const { value: isLaunchpadCollapsed } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_COLLAPSED,
  });
  const { value: isLaunchpadPinned = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  useEffect(() => {
    if (
      isLaunchpadCollapsed === undefined ||
      isLaunchpadDocked ||
      isLaunchpadPinned ||
      !io?.windows
    ) {
      return;
    }

    const apply = async () => {
      try {
        const myWindow = io.windows.my();

        if (!myWindow) {
          return;
        }

        const definitionMinHeight = myWindow.minHeight ?? WINDOW_CONFIG.EXPANDED.MIN_HEIGHT;
        const definitionMinWidth = myWindow.minWidth ?? WINDOW_CONFIG.EXPANDED.MIN_WIDTH;
        const minHeight = isLaunchpadCollapsed
          ? WINDOW_CONFIG.COLLAPSED.HEIGHT
          : definitionMinHeight;

        let height: number;

        if (isLaunchpadCollapsed) {
          if (prevCollapsedRef.current === false) {
            const bounds = await myWindow.getBounds();
            const currentHeight = bounds?.height;

            if (currentHeight && currentHeight >= definitionMinHeight) {
              persistExpandedHeight(currentHeight);
            }
          }

          height = WINDOW_CONFIG.COLLAPSED.HEIGHT;
        } else {
          const stored = getStoredExpandedHeight(definitionMinHeight);

          height = Number.isNaN(stored) ? WINDOW_CONFIG.EXPANDED.HEIGHT : stored;
        }

        prevCollapsedRef.current = isLaunchpadCollapsed;

        await myWindow.configure({ hasSizeAreas: !isLaunchpadCollapsed });
        await myWindow.setSizeConstraints({
          minWidth: definitionMinWidth,
          maxWidth: WINDOW_CONFIG.EXPANDED.MAX_WIDTH,
          minHeight,
        });
        await myWindow.moveResize({ height });
      } catch (error) {
        console.error("Failed to apply launchpad collapse state", error);
      }
    };

    void apply();
  }, [io, isLaunchpadCollapsed, isLaunchpadDocked, isLaunchpadPinned]);
}
