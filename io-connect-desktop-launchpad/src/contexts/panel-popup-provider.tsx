import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { IOActivePanelRenderer, usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";

export type PanelType = "preferences" | "notification-settings" | "profile";

interface PanelPopupContextValue {
  activePanel: PanelType | null;
  openPanel: (panelId: PanelType) => void;
  closePanel: () => void;
}

const PanelPopupContext = createContext<PanelPopupContextValue | null>(null);

export function PanelPopupProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);
  const { usePanelManagerContext } = IOActivePanelRenderer;
  const { selectPanel, deselectPanel } = usePanelManagerContext();

  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });

  // Close panel popup when undocking
  useEffect(() => {
    if (!isLaunchpadDocked && activePanel) {
      setActivePanel(null);
    }
  }, [isLaunchpadDocked, activePanel]);

  const openPanel = useCallback(
    (panelId: PanelType) => {
      if (isLaunchpadDocked) {
        // When docked, show panel in popup
        setActivePanel(panelId);
      } else {
        // When undocked, use the built-in panel renderer
        selectPanel(panelId);
      }
    },
    [isLaunchpadDocked, selectPanel]
  );

  const closePanel = useCallback(() => {
    setActivePanel(null);
    deselectPanel();
  }, [deselectPanel]);

  return (
    <PanelPopupContext.Provider value={{ activePanel, openPanel, closePanel }}>
      {children}
    </PanelPopupContext.Provider>
  );
}

export function usePanelPopupContext() {
  const context = useContext(PanelPopupContext);

  if (!context) {
    throw new Error("usePanelPopupContext must be used within PanelPopupProvider");
  }

  return context;
}
