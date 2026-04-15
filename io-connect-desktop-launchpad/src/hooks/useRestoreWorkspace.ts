import { useContext } from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectWorkspaces } from "@interopio/workspaces-api";
import { MODIFIER_KEYS, HOME_ALERT_VARIANTS } from "../constants/constants";
import { useFrameId } from "../hooks/useFrameId";
import { requestAlert } from "../utils/alerts";

export const useRestoreWorkspace = () => {
  const io = useContext(IOConnectContext);
  const frameId = useFrameId();

  return async ({
    id,
    modifier,
    reuseWorkspaceId,
  }: {
    id: string;
    modifier?: string | null;
    reuseWorkspaceId?: string;
  }) => {
    try {
      const restoreOptions: IOConnectWorkspaces.RestoreWorkspaceConfig =
        modifier === MODIFIER_KEYS.CONTROL ? { newFrame: true } : { frameId, reuseWorkspaceId };

      await io.workspaces?.restoreWorkspace(id, restoreOptions);
    } catch (error) {
      await requestAlert({
        io,
        variant: HOME_ALERT_VARIANTS.WARNING,
        text: `Failed to load Workspace "${id}".`,
        error,
      });
    }
  };
};
