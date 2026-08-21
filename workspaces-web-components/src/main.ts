import Workspaces from "@interopio/workspaces-ui-web-components";
import IOConnect from "@interopio/desktop";
import IOConnectWorkspaces from "@interopio/workspaces-api";

const render = () => {
    IOConnect({ appManager: "skipIcons", libraries: [IOConnectWorkspaces] }).then(async (io: any) => {
        (window as any).io = io;
        const workspacesElement = new Workspaces();
        document.body.appendChild(workspacesElement);
    });
};
render();