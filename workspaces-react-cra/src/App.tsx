import React, { useContext, useEffect } from 'react';
import Workspaces, { getFrameId } from "@interopio/workspaces-ui-react";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
import { IOConnectContext } from '@interopio/react-hooks';
import { IOConnectDesktop } from '@interopio/desktop';
import { IOConnectWorkspaces } from '@interopio/workspaces-api';
import AfterTabs from './AfterTabs';
import GroupHeaderButtons from './GroupHeaderButtons';

const App = () => {
    // (window as any).io = useContext(IOConnectContext);
    // (window as any).glue = (window as any).io;

    // useEffect(() => {
    //     const shortcuts: { [id: string]: () => void } = {};

    //     const registerKeyToFocusWS = async (frame: IOConnectWorkspaces.Frame, workspace: IOConnectWorkspaces.Workspace, index: number) => {
    //         if (index >= 9) {
    //             // we don't need to register
    //             return;
    //         }

    //         const key = `ctrl+${index}`;
    //         const un = await frame?.registerShortcut(key, () => {
    //             workspace.focus();
    //         })
    //         shortcuts[workspace.id] = un;
    //     };

    //     const registerKeyToOpenLastWS = (frame: IOConnectWorkspaces.Frame) => {
    //         frame.registerShortcut("ctrl+9", async () => {
    //             const ws = await frame.workspaces();
    //             ws[ws.length - 1]?.focus();
    //         });
    //     };

    //     const registerKeyToSwitchNextWS = (frame: IOConnectWorkspaces.Frame) => {
    //         frame.registerShortcut("ctrl+tab", async () => {
    //             const ws = await frame.workspaces();
    //             const selected = ws.find((ws) => ws.isSelected);
    //             const positionIndex = selected?.positionIndex;
    //             if (typeof positionIndex === "number") {
    //                 const nextWsIndex = positionIndex + 1;
    //                 let forSelecting: IOConnectWorkspaces.Workspace | undefined = ws[0];
    //                 if (nextWsIndex < ws.length) {
    //                     forSelecting = ws.find((w) => w.positionIndex === nextWsIndex);
    //                 }
    //                 forSelecting?.focus();
    //             }
    //         });
    //     };

    //     const registerKeyToCloseFocusedWS = (frame: IOConnectWorkspaces.Frame) => {
    //         frame.registerShortcut("ctrl+f4", async () => {
    //             const ws = await frame.workspaces();
    //             const selected = ws.find((ws) => ws.isSelected);
    //             selected?.close();
    //         });
    //     };

    //     const registerKeys = async (frame: IOConnectWorkspaces.Frame) => {
    //         const workspaces = await frame?.workspaces();
    //         workspaces.forEach((workspace, index) => {
    //             registerKeyToFocusWS(frame, workspace, index + 1);
    //         });
    //     }

    //     const ioTyped = (window as any).io as IOConnectDesktop.API;
    //     ioTyped?.workspaces?.waitForFrame(getFrameId())
    //         .then(async (frame) => {
    //             registerKeyToOpenLastWS(frame);
    //             registerKeyToSwitchNextWS(frame);
    //             registerKeyToCloseFocusedWS(frame);
    //             registerKeys(frame);

    //             frame?.onWorkspaceOpened(async (workspace) => {
    //                 const workspaces = await frame?.workspaces();
    //                 registerKeyToFocusWS(frame, workspace, workspaces.length);
    //             });
    //             frame?.onWorkspaceClosed(() => {
    //                 Object.values(shortcuts).forEach((un) => {
    //                     if (typeof un === "function") {
    //                         un();
    //                     }
    //                 });
    //                 registerKeys(frame);
    //             });
    //         })
    //     return () => {
    //         Object.values(shortcuts).forEach((un) => un());
    //     }
    // }, []);

    return (
        <Workspaces components={{
            header: {
                WorkspaceTabComponent: () => <></>
            }
            // groupHeader: {
            //     AfterTabsComponent: AfterTabs,
            //     ButtonsComponent: GroupHeaderButtons
            // }
        }} />
    );
}

export default App;