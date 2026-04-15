import { useMemo } from "react";
import { usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";
import PanelPopup from "../components/popups/panel-popup";
import { usePanelPopupContext } from "../contexts/panel-popup-provider";

export function usePanelPopup() {
  const { activePanel, closePanel } = usePanelPopupContext();
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  const panelPopup = useMemo(() => {
    if (!activePanel || !isLaunchpadDocked) {
      return null;
    }

    return <PanelPopup key={`panel-popup-${activePanel}`} hidePopup={closePanel} />;
  }, [activePanel, isLaunchpadDocked, closePanel]);

  return { panelPopup };
}
