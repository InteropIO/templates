import { useEffect, useMemo } from "react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { IOConnectDesktop } from "@interopio/desktop";
import { WINDOW_CONFIG, PLATFORM_PREFS_KEYS } from "../constants/constants";
import { getBounds } from "../utils/getBounds";
import LaunchpadBodyPopup from "../components/popups/launchpad-body-popup";
import { useLaunchpadBodyPopupContext } from "../contexts/search-popup-provider";

export function useSearchPopup() {
  const { showPopup, openPopup, closePopup } = useLaunchpadBodyPopupContext();
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  // Open search popup by typing or focusing the search input while docked
  useEffect(() => {
    if (!isLaunchpadDocked) {
      return;
    }

    const searchInput = document.querySelector<HTMLInputElement>("#search-input");

    if (!searchInput) {
      console.warn("Search input not found in the DOM");
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.key === "Shift" ||
        event.key === "Tab" ||
        event.key === "Enter" ||
        event.key.startsWith("Arrow")
      ) {
        return;
      }

      if (!showPopup && event.key.length === 1) {
        openPopup();
      }
    };

    const handleFocus = () => {
      if (!showPopup && searchInput.value.length > 0) {
        openPopup();
      }
    };

    searchInput.addEventListener("keydown", handleKeyDown);
    searchInput.addEventListener("focus", handleFocus);

    return () => {
      searchInput.removeEventListener("keydown", handleKeyDown);
      searchInput.removeEventListener("focus", handleFocus);
    };
  }, [showPopup, isLaunchpadDocked, openPopup]);

  // Hide popup if undocked while popup is showing
  useEffect(() => {
    if (showPopup && !isLaunchpadDocked) {
      closePopup();
    }
  }, [showPopup, isLaunchpadDocked]);

  // Close popup when clicking inside main window (but not on search input)
  useEffect(() => {
    if (!showPopup) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchInput = document.querySelector<HTMLInputElement>("#search-input");

      if (searchInput?.contains(target)) {
        return;
      }

      // Check if clicking on context menu button
      const contextMenuButton = target.closest(".main-context-menu");

      if (contextMenuButton) {
        // Close search popup first to avoid re-render interference
        closePopup();
        event.stopPropagation();
        event.preventDefault();
        // Dispatch custom event after re-render completes to open context menu
        requestAnimationFrame(() => {
          document.dispatchEvent(new CustomEvent("open-context-menu", { bubbles: true }));
        });

        return;
      }

      closePopup();
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [showPopup, closePopup]);

  const searchPopup = useMemo(() => {
    if (!showPopup) {
      return null;
    }

    const logoButton = document.querySelector<HTMLElement>(".logo-button");
    const buttonBounds = getBounds(logoButton);

    return (
      <LaunchpadBodyPopup
        key="launchpad-body-popup"
        popupTrigger={logoButton}
        popupConfig={{
          size: {
            width: WINDOW_CONFIG.DOCKED.BODY_WIDTH,
            height: WINDOW_CONFIG.DOCKED.BODY_HEIGHT,
          },
          targetLocation: "left" as IOConnectDesktop.Windows.PopupOptions["targetLocation"],
          focus: false,
          targetBounds: {
            left: buttonBounds.left,
            top: buttonBounds.top / 2 + buttonBounds.bottom,
            width: buttonBounds.width,
            height: buttonBounds.height,
          },
          horizontalOffset: -(buttonBounds.width + buttonBounds.y),
        }}
        hidePopup={closePopup}
      />
    );
  }, [showPopup]);

  return { searchPopup };
}
