import { useContext } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { MODIFIER_KEYS, HOME_ALERT_VARIANTS } from "../constants/constants";
import { requestAlert } from "../utils/alerts";
import { checkIsDesktop } from "../utils/checkIsDesktop";

type StartApplicationConfig = { id: string; modifier: string | null; title?: string };

export const useStartApplication = () => {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  const startDesktopApplication = async ({ id }: StartApplicationConfig) => {
    await io.appManager.application(id)?.start();
  };

  const startBrowserApplication = async ({ id, modifier }: StartApplicationConfig) => {
    const selectedWorkspace = await io.workspaces?.getWorkspace(
      (workspace) => workspace.isSelected === true
    );

    const outermostChild = selectedWorkspace?.children[0];

    const standalone =
      modifier === MODIFIER_KEYS.CONTROL || !selectedWorkspace || outermostChild?.type === "window";

    if (standalone) {
      await io.appManager.application(id)?.start();
      return;
    }

    const group =
      outermostChild?.type === "group"
        ? outermostChild
        : await (outermostChild ?? selectedWorkspace).addGroup();

    await group.addWindow({ appName: id });
  };

  return async (config: StartApplicationConfig) => {
    try {
      const startApplication = checkIsDesktop() ? startDesktopApplication : startBrowserApplication;

      await startApplication(config);
    } catch (error) {
      await requestAlert({
        io,
        variant: HOME_ALERT_VARIANTS.WARNING,
        text: `Failed to start app "${config.title}".`,
        error,
      });
    }
  };
};
