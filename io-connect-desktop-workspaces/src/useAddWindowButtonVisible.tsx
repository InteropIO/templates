import { Glue42 } from "@glue42/desktop";
import { IOConnectWorkspaces } from "@interopio/workspaces-api";
import { useEffect, useState } from "react";

declare const window: Window & { io: Glue42.Glue };

export function useAddWindowButtonVisible(workspaceId: string, groupId: string) {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        let groupLockConfigUnsub: IOConnectWorkspaces.Unsubscribe = () => { };
        (async () => {
            const workspace = await window.io.workspaces!.getWorkspaceById(workspaceId);
            const group = workspace.getAllGroups().find(g => g.id === groupId);

            if (!group) {
                return;
            }

            groupLockConfigUnsub = await group.onLockConfigurationChanged((lockConfig) => {
                setVisible(lockConfig.showAddWindowButton!);
            });

            setVisible(!!group.showAddWindowButton);
        })();

        return groupLockConfigUnsub;
    }, [workspaceId, groupId]);

    return visible;
}