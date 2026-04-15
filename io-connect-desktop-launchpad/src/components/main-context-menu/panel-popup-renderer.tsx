import { ComponentType } from "react";
import { IONotifications, IOPreferencesDesktop, IOProfile } from "@interopio/home-ui-react";
import { usePopupWindow } from "@interopio/components-react";
import { usePanelPopupContext, PanelType } from "../../contexts/panel-popup-provider";

const NotificationsSettingsPanel = IONotifications.SettingsPanel;
const PreferencesPanel = IOPreferencesDesktop.Panel;
const ProfilePanel = IOProfile.Panel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PANEL_COMPONENTS: Record<PanelType, ComponentType<any>> = {
  preferences: PreferencesPanel,
  "notification-settings": NotificationsSettingsPanel,
  profile: ProfilePanel,
};

export function PanelPopupRenderer() {
  const { activePanel, closePanel } = usePanelPopupContext();
  const { closePopup } = usePopupWindow();

  if (!activePanel) {
    return null;
  }

  const PanelComponent = PANEL_COMPONENTS[activePanel];

  if (!PanelComponent) {
    console.error("No panel component found for:", activePanel);
    return null;
  }

  const handleClose = async () => {
    // Close popup window first to avoid a blank shell, then clear panel state.
    try {
      await closePopup();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Failed to close popup window", err);
    }

    closePanel();
  };

  return <PanelComponent onClose={handleClose} />;
}
