import { IOConnectDesktop } from "@interopio/desktop";
import ExternalPopup from "./external-popup";
import { PanelPopupRenderer } from "../main-context-menu/panel-popup-renderer";
import { WINDOW_CONFIG } from "../../constants/constants";
import { getBounds } from "../../utils/getBounds";

interface PanelPopupProps {
  hidePopup: () => void;
}

function PanelPopup({ hidePopup }: Readonly<PanelPopupProps>) {
  const menuButton = document.querySelector<HTMLElement>(".main-context-menu .io-btn-icon");
  const buttonBounds = getBounds(menuButton);

  return (
    <ExternalPopup
      popupTrigger={menuButton}
      popupConfig={{
        size: {
          width: WINDOW_CONFIG.DOCKED.BODY_WIDTH,
          height: WINDOW_CONFIG.DOCKED.BODY_HEIGHT,
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
    >
      <PanelPopupRenderer />
    </ExternalPopup>
  );
}

export default PanelPopup;
