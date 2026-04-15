import { useState, useContext, useEffect } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";

export const useApplicationsInstances = () => {
  const [runningInstances, setRunningInstances] = useState<{
    [appName: string]: string[];
  }>({});

  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  useEffect(() => {
    if (!io) {
      return;
    }

    const unsubscribeOnInstanceStarted = io.appManager.onInstanceStarted((startedInstance) => {
      setRunningInstances((prevRunningInstances) => {
        const appCurrentRunningInstances =
          prevRunningInstances[startedInstance.application.name] ?? [];

        return {
          ...prevRunningInstances,
          [startedInstance.application.name]: [...appCurrentRunningInstances, startedInstance.id],
        };
      });
    });

    const unsubscribeOnInstanceStopped = io.appManager.onInstanceStopped((stoppedInstance) => {
      setRunningInstances((prevRunningInstances) => {
        const appCurrentRunningInstances = prevRunningInstances[stoppedInstance.application.name];

        if (!appCurrentRunningInstances) {
          return prevRunningInstances;
        }

        return {
          ...prevRunningInstances,
          [stoppedInstance.application.name]: appCurrentRunningInstances.filter(
            (instanceId) => instanceId !== stoppedInstance.id
          ),
        };
      });
    });

    const unsubscribeFns = [unsubscribeOnInstanceStarted, unsubscribeOnInstanceStopped];

    return () => unsubscribeFns.forEach((unsubscribeFn) => unsubscribeFn());
  }, [io]);

  return runningInstances;
};
