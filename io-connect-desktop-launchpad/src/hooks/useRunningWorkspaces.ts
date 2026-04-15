import { useContext, useState, useEffect } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectWorkspaces } from "@interopio/workspaces-api";

export function useRunningWorkspaces() {
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const [runningWorkspaces, setRunningWorkspaces] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!io?.workspaces) {
      return;
    }

    const unsubscribeArr: (IOConnectWorkspaces.Unsubscribe | undefined)[] = [];

    (async () => {
      const workspacesApi = io.workspaces;

      if (!workspacesApi) {
        return;
      }

      try {
        // Seed with already running workspaces
        const existing = await workspacesApi.getAllWorkspaces();

        setRunningWorkspaces(
          existing.map((workspace) => ({ id: workspace.id, title: workspace.title }))
        );
      } catch (error) {
        console.error("Failed to get existing workspaces", error);
      }

      const handleWorkspaceOpened = (workspace: IOConnectWorkspaces.Workspace) => {
        setRunningWorkspaces((prev) =>
          prev.some((ws) => ws.id === workspace.id)
            ? prev
            : [...prev, { id: workspace.id, title: workspace.title }]
        );
      };

      const handleWorkspaceClosed = (workspace: IOConnectWorkspaces.WorkspaceClosedData) => {
        setRunningWorkspaces((prev) => prev.filter((ws) => ws.id !== workspace.workspaceId));
      };

      try {
        const unsubscribeOnWorkspaceOpened =
          await workspacesApi.onWorkspaceOpened(handleWorkspaceOpened);
        unsubscribeArr.push(unsubscribeOnWorkspaceOpened);
      } catch (error) {
        console.error("Failed to subscribe to workspace opened events", error);
      }

      try {
        const unsubscribeOnWorkspaceClosed =
          await workspacesApi.onWorkspaceClosed(handleWorkspaceClosed);
        unsubscribeArr.push(unsubscribeOnWorkspaceClosed);
      } catch (error) {
        console.error("Failed to subscribe to workspace closed events", error);
      }
    })();

    return () => {
      for (const unsubscribe of unsubscribeArr) {
        unsubscribe?.();
      }
    };
  }, [io]);

  return runningWorkspaces;
}
