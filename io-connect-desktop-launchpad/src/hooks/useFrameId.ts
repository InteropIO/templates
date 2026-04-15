import { useState, useEffect, useContext } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { getFrameId } from "@interopio/workspaces-ui-react";

export const useFrameId = (): string | undefined => {
  const [currentFrameId, setCurrentFrameId] = useState<string | undefined>();

  const io = useContext(IOConnectContext) as IOConnectDesktop.API;

  useEffect(() => {
    try {
      // the result of io.windows.my() if called from inside a frame is undefined in io.CD and an empty object in io.CB, hence the following check
      const isInFrame = !io.windows.my()?.name;
      const frameId = isInFrame ? getFrameId() : undefined;

      setCurrentFrameId(frameId);
    } catch (error) {
      console.error("Failed to get the current frame ID ", { error });
    }
  }, [io, getFrameId, setCurrentFrameId]);

  return currentFrameId;
};
