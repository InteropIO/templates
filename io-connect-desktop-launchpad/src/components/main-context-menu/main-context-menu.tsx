import { useCallback, useRef, useState, useEffect, HTMLAttributes } from "react";
import classNames from "classnames";
import { IOConnectDesktop } from "@interopio/desktop";
import { ButtonIcon } from "@interopio/components-react";
import MainContextMenuPopup from "../popups/main-context-menu-popup";
import { getBounds } from "../../utils/getBounds";
import { WINDOW_CONFIG } from "../../constants/constants";

function MainContextMenu({ className, ...rest }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);

  const hidePopup = useCallback(() => {
    isClosingRef.current = true;
    setShowPopup(false);

    // Reset the flag after a short delay to allow clicks again
    setTimeout(() => {
      isClosingRef.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const button = buttonRef.current;
    const clickListener = (event: MouseEvent) => {
      event.stopPropagation();

      // Prevent reopening if we just closed due to focus loss
      if (isClosingRef.current) {
        return;
      }

      if (showPopup) {
        // If popup is already open, close it
        setShowPopup(false);
      } else {
        // If popup is closed, open it
        setShowPopup(true);
      }
    };

    button.addEventListener("click", clickListener);

    return () => {
      button?.removeEventListener("click", clickListener);
    };
  }, [showPopup]);

  // Listen for custom event triggered after search popup closes
  useEffect(() => {
    const handleOpenContextMenu = () => {
      if (!showPopup && !isClosingRef.current) {
        setShowPopup(true);
      }
    };

    document.addEventListener("open-context-menu", handleOpenContextMenu);

    return () => {
      document.removeEventListener("open-context-menu", handleOpenContextMenu);
    };
  }, [showPopup]);

  const buttonBounds = getBounds(buttonRef.current);

  return (
    <div className={classNames("main-context-menu", "non-draggable", className)} {...rest}>
      <ButtonIcon
        ref={buttonRef}
        variant="circle"
        icon="ellipsis-vertical"
        size="32"
        title="More"
      />
      {showPopup && (
        <MainContextMenuPopup
          popupTrigger={buttonRef.current}
          popupConfig={{
            size: {
              width: WINDOW_CONFIG.MAIN_CONTEXT_MENU.WIDTH,
              height: WINDOW_CONFIG.MAIN_CONTEXT_MENU.HEIGHT,
            },
            targetLocation: "left" as IOConnectDesktop.Windows.PopupOptions["targetLocation"],
            targetBounds: {
              left: buttonBounds.left,
              top: buttonBounds.top / 2 + buttonBounds.bottom,
              width: buttonBounds.width,
              height: buttonBounds.height,
            },
            horizontalOffset: -buttonBounds.width,
          }}
          hidePopup={hidePopup}
        />
      )}
    </div>
  );
}

export default MainContextMenu;
