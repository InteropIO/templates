import { useCallback, useContext } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { PLATFORM_APPS, PLATFORM_UTILITY_PAGES } from "../../constants/constants";
import { startApp, startPage } from "../../utils/interopHelpers";
import { MenuItemConfig } from "../../types";

export function useDownloadsMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  const handleOpenDownloads = useCallback(() => {
    void (async () => {
      try {
        await startApp(io, PLATFORM_APPS.DOWNLOAD_MANAGER);
      } catch (error) {
        console.warn("Failed to open Downloads app", error);
      }
    })();
  }, [io]);

  return {
    label: "Downloads",
    icon: "arrow-down-to-bracket",
    onClick: handleOpenDownloads,
  };
}

export function useFeedbackMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  const handleOpenFeedback = useCallback(() => {
    void (async () => {
      try {
        await startPage(io, PLATFORM_UTILITY_PAGES.FEEDBACK);
      } catch (error) {
        console.warn("Failed to open Feedback page", error);
      }
    })();
  }, [io]);

  return {
    label: "Feedback",
    icon: "feedback",
    onClick: handleOpenFeedback,
  };
}

export function useHotkeysMenuItem(): MenuItemConfig {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  const handleOpenHotkeys = useCallback(() => {
    void (async () => {
      try {
        await startPage(io, PLATFORM_UTILITY_PAGES.HOTKEYS);
      } catch (error) {
        console.warn("Failed to open Hotkeys page", error);
      }
    })();
  }, [io]);

  return {
    label: "Keyboard Shortcuts",
    icon: "keyboard",
    onClick: handleOpenHotkeys,
  };
}
