import { GroupHeaderButtons as DefaultGroupHeaderButtons, GroupHeaderButtonsProps } from "@interopio/workspaces-ui-react";
import React from "react";

const GroupHeaderButtons: React.FC<GroupHeaderButtonsProps> = (props) => {
    return <DefaultGroupHeaderButtons {...props} addWindow={{ visible: false, showPopup: props.addWindow.showPopup }} />;
}


export default GroupHeaderButtons;