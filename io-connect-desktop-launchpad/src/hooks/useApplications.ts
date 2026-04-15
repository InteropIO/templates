import { useState, useContext, useEffect } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";

type Application = Pick<
  IOConnectDesktop.AppManager.Application,
  "name" | "icon" | "caption" | "userProperties"
> & {
  id: string;
  title: string;
};

export const useApplications = (): Application[] => {
  const [applications, setApplications] = useState<Application[]>([]);

  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  useEffect(() => {
    if (!io) {
      return;
    }

    const transformApp = (app: IOConnectDesktop.AppManager.Application): Application => {
      const { name, title, caption, icon, userProperties } = app;

      return { id: name, name, title: title ?? name, caption, icon, userProperties };
    };

    const unsubscribeOnAppAdded = io.appManager.onAppAdded((app) => {
      // TODO: remove when "hidden" is added on top level in io.CB
      if (app.userProperties.hidden || ("hidden" in app && app.hidden)) {
        return;
      }

      const addedApplication = transformApp(app);

      setApplications((prevApplications) => [...prevApplications, addedApplication]);
    });

    const unsubscribeOnAppChanged = io.appManager.onAppChanged((app) => {
      // TODO: remove when "hidden" is added on top level in io.CB
      if (app.userProperties.hidden || ("hidden" in app && app.hidden)) {
        return;
      }

      const changedApplication = transformApp(app);

      setApplications((prevApplications) => [
        ...prevApplications.filter((application) => application.id !== changedApplication.id),
        changedApplication,
      ]);
    });

    const unsubscribeOnAppRemoved = io.appManager.onAppRemoved((app) => {
      const removedApplication = transformApp(app);

      setApplications((prevApplications) =>
        prevApplications.filter((application) => application.id !== removedApplication.id)
      );
    });

    const unsubscribeFns = [
      unsubscribeOnAppAdded,
      unsubscribeOnAppRemoved,
      unsubscribeOnAppChanged,
    ];

    return () => unsubscribeFns.forEach((unsubscribeFn) => unsubscribeFn());
  }, [io]);

  return applications;
};
