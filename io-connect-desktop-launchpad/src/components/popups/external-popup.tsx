import { ReactNode, useRef, useEffect, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { usePopupWindow } from "@interopio/components-react";
import { PopupConfig } from "../../types";

const FOCUS_TRANSITION_DELAY = 150;

export interface ExternalPopupProps {
  popupTrigger?: HTMLElement | null;
  popupConfig?: PopupConfig;
  hidePopup: () => void;
  children?: ReactNode;
}

function ExternalPopup({
  popupTrigger,
  popupConfig,
  hidePopup,
  children,
}: Readonly<ExternalPopupProps>) {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const mainWindow = io?.windows?.my();
  const { popup, getContainer, isVisible, createPopup, showPopup, closePopup } = usePopupWindow();
  const wasVisibleRef = useRef(false);
  const focusOption = popupConfig?.focus ?? true;
  const focusTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(async () => {
    try {
      await closePopup();
    } catch (error) {
      console.error("Error closing popup:", error);
    }
  }, [closePopup]);

  const container = getContainer();

  useEffect(() => {
    createPopup({
      transparent: true,
      copyStyles: true,
    })
      .then((popup) => {
        if (!popup) {
          return;
        }

        popup.ioConnectWindow.configure({ search: { enabled: false } });
      })
      .catch((error) => {
        console.error("Error creating popup:", error);
      });

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!popup) {
      return;
    }

    const showPopupAsync = async () => {
      try {
        // Derive targetBounds from popupTrigger if not explicitly provided.
        let targetBounds = popupConfig?.targetBounds;

        if (!targetBounds && popupTrigger) {
          const rect = popupTrigger.getBoundingClientRect();

          targetBounds = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          } as PopupConfig["targetBounds"];
        }

        await showPopup({
          size: {
            width: popupConfig?.size?.width,
            height: popupConfig?.size?.height,
          },
          targetBounds,
          targetLocation:
            popupConfig?.targetLocation ?? ("bottom" as PopupConfig["targetLocation"]),
          focus: focusOption,
          horizontalOffset: popupConfig?.horizontalOffset,
          verticalOffset: popupConfig?.verticalOffset,
        });
      } catch (error) {
        console.error("Error showing popup:", error);
      }
    };

    showPopupAsync();
  }, [popup, popupTrigger, popupConfig, showPopup]);

  useEffect(() => {
    if (!isVisible && wasVisibleRef.current) {
      hidePopup();
    }

    wasVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    if (!popup) {
      return;
    }

    if (!mainWindow) {
      console.warn("Main window not available");
      return;
    }

    const handleMainWindowFocusChange = (mainWin: { isFocused: boolean }) => {
      // Clear any pending timeout
      if (focusTransitionTimeoutRef.current) {
        clearTimeout(focusTransitionTimeoutRef.current);
        focusTransitionTimeoutRef.current = null;
      }

      // Main window gained focus - keep popup open
      if (mainWin.isFocused) {
        return;
      }

      // Main window lost focus - wait to see if popup gains focus (or if main regains focus)
      focusTransitionTimeoutRef.current = globalThis.setTimeout(() => {
        // Check current focus state of both windows
        const popupHasFocus = focusOption ? popup.ioConnectWindow.isFocused : false;
        const mainHasFocus = mainWindow.isFocused;

        // Close if neither has focus
        if (!popupHasFocus && !mainHasFocus) {
          cleanup();
        }
      }, FOCUS_TRANSITION_DELAY);
    };

    const handlePopupFocusChange = (popupWin: { isFocused: boolean }) => {
      // Clear timeout if popup gains focus
      if (popupWin.isFocused && focusTransitionTimeoutRef.current) {
        clearTimeout(focusTransitionTimeoutRef.current);
        focusTransitionTimeoutRef.current = null;
        return;
      }

      // Popup lost focus - wait to see if main window gains focus
      if (!popupWin.isFocused && focusTransitionTimeoutRef.current === null) {
        focusTransitionTimeoutRef.current = globalThis.setTimeout(() => {
          // Check if either window has focus
          const popupHasFocus = popup.ioConnectWindow.isFocused;
          const mainHasFocus = mainWindow.isFocused;

          if (!popupHasFocus && !mainHasFocus) {
            // Neither has focus - close popup
            cleanup();
          }
        }, FOCUS_TRANSITION_DELAY);
      }
    };

    const unsubscribeMain = mainWindow.onFocusChanged(handleMainWindowFocusChange);
    const unsubscribePopup = popup.ioConnectWindow.onFocusChanged(handlePopupFocusChange);

    return () => {
      if (focusTransitionTimeoutRef.current) {
        clearTimeout(focusTransitionTimeoutRef.current);
      }
      unsubscribeMain?.();
      unsubscribePopup?.();
    };
  }, [popup, popupConfig, cleanup, mainWindow, focusOption]);

  if (!container) {
    return <></>;
  }

  return createPortal(children, container);
}

export default ExternalPopup;
