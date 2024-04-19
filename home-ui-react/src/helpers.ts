import IOBrowserPlatform from '@interopio/browser-platform';
import IOWorkspaces from '@interopio/workspaces-api';
import { IOConnectInitSettings } from '@interopio/react-hooks';

export const getIOConfig = (): IOConnectInitSettings => {
  return {
    browserPlatform: {
      factory: IOBrowserPlatform,
      config: {
        workspaces: {
          src: '/',
          isFrame: true,
        },
        layouts: {
          mode: 'idb',
        },
        gateway: {
          logging: {
            level: 'warn',
          },
        },
        browser: {
          libraries: [IOWorkspaces],
          systemLogger: {
            level: 'warn',
          },
        },
        licenseKey: process.env.REACT_APP_IOCONNECT_BROWSER_LICENSE as string,
      },
    },
  };
};
