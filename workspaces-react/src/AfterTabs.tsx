import { AddWindowButton, Bounds, showAddApplicationPopup } from "@interopio/workspaces-ui-react";
import React, { Fragment } from "react";
import { useAddWindowButtonVisible } from "./useAddWindowButtonVisible";

interface AfterTabsProps {
    groupId: string;
    workspaceId: string;
    isAddWindowPopupActive?: boolean;
}

const AfterTabs: React.FC<AfterTabsProps> = ({ groupId, workspaceId, isAddWindowPopupActive }) => {
    const visible = useAddWindowButtonVisible(workspaceId, groupId);

    const showPopup = (bounds: Bounds) => {
        showAddApplicationPopup({
            bounds,
            groupId,
            workspaceId,
        });
    };

    return <>
        {visible ? <AddWindowButton title="Add App" visible={visible} showPopup={showPopup} isAddWindowPopupActive={isAddWindowPopupActive} /> : <Fragment />}
    </>;
}


export default AfterTabs;