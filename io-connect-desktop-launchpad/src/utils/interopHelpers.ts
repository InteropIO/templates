import { IOConnectDesktop } from "@interopio/desktop";

export async function startPage(io: IOConnectDesktop.API | undefined, pageName: string) {
  if (!io) {
    console.warn("IOConnectContext not available");
    return;
  }

  try {
    await io.interop.invoke("T42.GD.Execute", {
      command: "open-utility-page",
      args: { name: pageName },
    });
  } catch (error) {
    console.warn("Failed to open utility page", pageName, error);
  }
}

export async function startApp(io: IOConnectDesktop.API | undefined, appName: string) {
  if (!io) {
    console.warn("IOConnectContext not available");
    return;
  }

  try {
    const app = io.appManager.application(appName);

    if (!app) {
      throw new Error(`Cannot find app with name "${appName}"`);
    }

    await app.start();
  } catch (error) {
    console.warn("Failed to start app", appName, error);
  }
}
