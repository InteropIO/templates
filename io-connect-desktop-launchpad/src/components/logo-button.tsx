import { useCallback, useRef, useContext, HTMLAttributes } from "react";
import classNames from "classnames";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { ButtonIcon, usePointerActions } from "@interopio/components-react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";
import { useLaunchpadBodyPopupContext } from "../contexts/search-popup-provider";

function LogoButton({ className, ...rest }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const myWindow = io?.windows?.my();
  const { togglePopup } = useLaunchpadBodyPopupContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { value: isLaunchpadCollapsed = false, update: setIsLaunchpadCollapsed } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_COLLAPSED,
  });
  const { value: isLaunchpadPinned = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: isLaunchpadDocked = false, update: setIsLaunchpadDocked } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  const handleLogoClick = useCallback(async () => {
    if (isLaunchpadDocked) {
      togglePopup();
    } else if (!isLaunchpadPinned) {
      setIsLaunchpadCollapsed(!isLaunchpadCollapsed);
    }
  }, [isLaunchpadDocked, isLaunchpadPinned, isLaunchpadCollapsed, togglePopup]);

  const isDraggable = (!isLaunchpadPinned && !isLaunchpadDocked) || isLaunchpadDocked;

  const noDragHandler = useCallback(() => {
    // No drag action when not draggable
  }, []);

  const handleDragMove = useCallback(async () => {
    if (!myWindow) {
      return;
    }

    try {
      if (isLaunchpadDocked) {
        await setIsLaunchpadDocked(false);
      }

      await myWindow.dragMove();
    } catch (error) {
      console.error("Failed to drag move window:", error);
    }
  }, [myWindow, isLaunchpadDocked]);

  const { onPointerDown, onPointerMove, onPointerUp } = usePointerActions({
    onClick: handleLogoClick,
    onDrag: isDraggable ? handleDragMove : noDragHandler,
  });

  const isClickable = (!isLaunchpadPinned && !isLaunchpadDocked) || isLaunchpadDocked;

  let buttonTitle = "Close Launchpad";

  if (isLaunchpadPinned || isLaunchpadDocked) {
    buttonTitle = "io.Connect Launchpad";
  } else if (isLaunchpadCollapsed) {
    buttonTitle = "Open Launchpad";
  }

  const buttonClassName = `logo-button ${isClickable ? "" : "no-hover"}`;

  return (
    <div className={classNames("logo", "non-draggable", className)} {...rest}>
      <ButtonIcon
        ref={buttonRef}
        className={buttonClassName}
        variant="circle"
        icon="logo"
        size="32"
        title={buttonTitle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}

export default LogoButton;
