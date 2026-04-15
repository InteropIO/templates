import { useState, useContext, useEffect } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";

interface Workspace {
  id: string;
  title: string;
}

export const useWorkspaces = (): Workspace[] => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  useEffect(() => {
    if (!io?.workspaces) {
      return;
    }

    let isUnsubscribed = false;

    const unsubscribeOnSaved = io.workspaces.layouts.onSaved(({ name }) => {
      if (isUnsubscribed || workspaces.some(({ id }) => id === name)) {
        return;
      }

      setWorkspaces((current) => [...current, { id: name, title: name }]);
    });

    const unsubscribeOnRemoved = io.workspaces.layouts.onRemoved(({ name }) => {
      if (isUnsubscribed) {
        return;
      }

      setWorkspaces((current) => current.filter(({ id }) => id !== name));
    });

    const unsubscribeOnRenamed = io.layouts.onRenamed((renamedLayout, previous) => {
      if (isUnsubscribed || renamedLayout.type !== "Workspace") {
        return;
      }

      const { name } = renamedLayout;

      setWorkspaces((current) => {
        const renamedWorkspaceIndex = current.findIndex(
          (workspace) => workspace.id === previous?.name
        );

        return renamedWorkspaceIndex === -1
          ? current
          : [
              ...current.slice(0, renamedWorkspaceIndex),
              { id: name, title: name },
              ...current.slice(renamedWorkspaceIndex + 1),
            ];
      });
    });

    return () => {
      isUnsubscribed = true;

      unsubscribeOnRenamed();

      [unsubscribeOnSaved, unsubscribeOnRemoved].forEach(async (promise) => {
        try {
          const unsubscribe = await promise;

          unsubscribe();
        } catch (error) {
          console.error(error);
        }
      });
    };
  }, [io, workspaces]);

  return workspaces;
};
