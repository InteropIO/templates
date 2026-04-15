import { IOConnectDesktop } from "@interopio/desktop";
import { startApp } from "../utils/interopHelpers";
import { PLATFORM_APPS } from "../constants/constants";

export function showTutorialIfEnabled(io: IOConnectDesktop.API, show: boolean) {
  if (show) {
    startApp(io, PLATFORM_APPS.GETTING_STARTED);
  }
}
