import IODesktop from "@interopio/desktop";
import IOSearch from "@interopio/search-api";
import IOWorkspaces from "@interopio/workspaces-api";
import IOModalsAPI from "@interopio/modals-api";
import { IOConnectInitSettings } from "@interopio/react-hooks";

export const ioConfig = {
  desktop: {
    factory: IODesktop,
    config: {
      gateway: {
        logging: {
          level: "warn",
        },
      },
      libraries: [IOWorkspaces, IOSearch, IOModalsAPI],
      appManager: "full",
      layouts: "full",
      activities: "trackAll",
      channels: false,
      metrics: false,
      contexts: true,
      systemLogger: {
        level: "warn",
      },
    },
  },
} as IOConnectInitSettings;
