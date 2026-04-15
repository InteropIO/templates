import { useCallback, useMemo, MouseEvent, KeyboardEvent } from "react";
import { Icon, List, IOA11y } from "@interopio/components-react";
import ExternalPopup, { ExternalPopupProps } from "../popups/external-popup";
import {
  usePinLaunchpadMenuItem,
  useDockLaunchpadMenuItem,
  useMinimizeMenuItem,
} from "../main-context-menu/launchpad-state-menu-items";
import {
  usePreferencesMenuItem,
  useNotificationSettingsMenuItem,
  useProfileMenuItem,
} from "../main-context-menu/panel-menu-items";
import {
  useDownloadsMenuItem,
  useFeedbackMenuItem,
  useHotkeysMenuItem,
} from "../main-context-menu/external-app-menu-items";
import {
  useRestartMenuItem,
  useShutdownMenuItem,
} from "../main-context-menu/system-control-menu-items";
import { MenuItem } from "../../types";

const { isClickKeypress } = IOA11y;

function MainContextMenuPopup({
  popupTrigger,
  popupConfig,
  hidePopup,
}: Readonly<ExternalPopupProps>) {
  const pinLaunchpadItem = usePinLaunchpadMenuItem();
  const dockLaunchpadItem = useDockLaunchpadMenuItem();
  const preferencesItem = usePreferencesMenuItem();
  const notificationSettingsItem = useNotificationSettingsMenuItem();
  const profileItem = useProfileMenuItem();
  const downloadsItem = useDownloadsMenuItem();
  const feedbackItem = useFeedbackMenuItem();
  const hotkeysItem = useHotkeysMenuItem();
  const minimizeItem = useMinimizeMenuItem();
  const restartItem = useRestartMenuItem();
  const shutdownItem = useShutdownMenuItem();
  const popupProps = {
    popupTrigger,
    popupConfig,
    hidePopup,
  };

  const menuItems: MenuItem[] = useMemo(
    () => [
      pinLaunchpadItem,
      dockLaunchpadItem,
      { separator: true },
      preferencesItem,
      notificationSettingsItem,
      { separator: true },
      profileItem,
      { separator: true },
      downloadsItem,
      { separator: true },
      feedbackItem,
      hotkeysItem,
      { separator: true },
      minimizeItem,
      restartItem,
      shutdownItem,
    ],
    [
      pinLaunchpadItem,
      dockLaunchpadItem,
      preferencesItem,
      notificationSettingsItem,
      profileItem,
      downloadsItem,
      feedbackItem,
      hotkeysItem,
      minimizeItem,
      restartItem,
      shutdownItem,
    ]
  );

  const handleItemClick = useCallback(
    async (itemOnClick: () => void, event: MouseEvent | KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();

      itemOnClick();
      hidePopup();
    },
    [hidePopup]
  );

  return (
    <ExternalPopup {...popupProps}>
      <List>
        {menuItems.map((item, index) => {
          if ("separator" in item) {
            const nextItem = menuItems[index + 1];
            const key = nextItem && "label" in nextItem ? `sep-${nextItem.label}` : `sep-${index}`;

            return <List.ItemSeparator key={key} />;
          }

          return (
            <List.Item
              key={item.label}
              prepend={<Icon variant={item.icon} />}
              onClick={(event) => handleItemClick(item.onClick, event)}
              disabled={item.disabled}
              tabIndex={item.disabled ? -1 : 0}
              aria-label={item.label}
              aria-disabled={item.disabled}
              onKeyDown={(event) => {
                if (!item.disabled && isClickKeypress(event)) {
                  handleItemClick(item.onClick, event);
                }
              }}
            >
              {item.label}
            </List.Item>
          );
        })}
      </List>
    </ExternalPopup>
  );
}

export default MainContextMenuPopup;
