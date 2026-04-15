import {
  LaunchpadContentsContainer,
  IONotifications,
  IOActivePanelRenderer,
  IODownloadManager,
  PlatformPrefsProvider,
  usePlatformPref,
  LaunchpadHeader,
  LaunchpadBody,
} from "@interopio/home-ui-react";
import { ThemeProvider } from "@interopio/components-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";
import DragHandle from "./drag-handle";
import LogoButton from "./logo-button";
import ExtendedArea from "./extended-area/extended-area";
import NotificationsButton from "./notifications-button";
import MainContextMenu from "./main-context-menu/main-context-menu";
import { useLaunchpadPinning } from "../hooks/useLaunchpadPinning";
import { useLaunchpadDocking } from "../hooks/useLaunchpadDocking";
import { useLaunchpadMinimizeToTray } from "../hooks/useLaunchpadMinimizeToTray";
import { useLaunchpadCollapse } from "../hooks/useLaunchpadCollapse";
import { useRecent } from "../hooks/useRecent";
import { useSearchPopup } from "../hooks/useSearchPopup";
import { usePanelPopup } from "../hooks/usePanelPopup";
import { LaunchpadBodyPopupProvider } from "../contexts/search-popup-provider";
import { PanelPopupProvider } from "../contexts/panel-popup-provider";

const { ActivePanelRenderer } = IOActivePanelRenderer;
const { NotificationsProvider } = IONotifications;
const { DownloadManagerProvider } = IODownloadManager;
const { PanelManagerProvider } = IOActivePanelRenderer;

function LaunchpadWrapper() {
  return (
    <ThemeProvider>
      <PlatformPrefsProvider>
        <NotificationsProvider>
          <DownloadManagerProvider>
            <PanelManagerProvider>
              <PanelPopupProvider>
                <LaunchpadBodyPopupProvider>
                  <LaunchpadApp />
                </LaunchpadBodyPopupProvider>
              </PanelPopupProvider>
            </PanelManagerProvider>
          </DownloadManagerProvider>
        </NotificationsProvider>
      </PlatformPrefsProvider>
    </ThemeProvider>
  );
}

function LaunchpadApp() {
  const { value: isLaunchpadPinned = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_PINNED,
  });
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const { value: isLaunchpadExtendedAreaVisible = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_SHOW_EXTENDED_AREA,
  });

  useLaunchpadMinimizeToTray();
  useLaunchpadCollapse();
  useLaunchpadPinning();
  useLaunchpadDocking();
  useRecent();

  const { searchPopup } = useSearchPopup();
  const { panelPopup } = usePanelPopup();

  return (
    <LaunchpadContentsContainer
      className={isLaunchpadDocked ? "docked" : ""}
      components={{
        header: {
          BeforeSearch: () => (
            <>
              {!isLaunchpadPinned && <DragHandle />}
              <LogoButton />
            </>
          ),
          AfterSearch: () => (
            <>
              {isLaunchpadDocked && isLaunchpadExtendedAreaVisible && <ExtendedArea />}
              <NotificationsButton />
              <MainContextMenu />
            </>
          ),
        },
      }}
    >
      <LaunchpadHeader />
      {!isLaunchpadDocked && <LaunchpadBody />}
      {!isLaunchpadDocked && <ActivePanelRenderer />}
      {isLaunchpadDocked && searchPopup}
      {isLaunchpadDocked && panelPopup}
    </LaunchpadContentsContainer>
  );
}

export default LaunchpadWrapper;
