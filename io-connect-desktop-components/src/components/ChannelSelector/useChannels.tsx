import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOChannelSelector, useKeyDown } from "@interopio/components-react";

interface ChannelSelectorAction {
  command: "will-show";
  windowId: string;
  channels: IOConnectDesktop.ChannelContext[];
  variant: "single" | "directionalSingle";
}

interface ChannelSelectorActionResult {
  height: number;
  width: number;
  x: number;
  y: number;
}

function getChannelProps(
  channelInfo: IOConnectDesktop.ChannelContext[],
  selectedColor?: string
): IOChannelSelector.ChannelInfo[] {
  const letters = Array.from({ length: channelInfo.length }, (_, i) =>
    String.fromCharCode(i + 65)
  );
  return channelInfo.map((c, i) => {
    const meta = c.meta as {
      color: string;
    };
    return {
      key: c.name,
      color: meta.color,
      name: c.name,
      isSelected: c.name === selectedColor,
      label: letters[i],
    };
  });
}

export default function useChannels(refUl: React.RefObject<HTMLDivElement>) {
  const methodName = "T42.ChannelSelector.Execute";
  const io = useContext(IOConnectContext) as IOConnectDesktop.API;
  const [channels, setChannels] = useState<
    IOChannelSelector.ChannelInfo[] | null
  >(null);
  const [windowId, setWindowId] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [variant, setVariant] = useState<"single" | "directionalSingle">(
    "single"
  );
  const successCallback =
    useRef<(args?: ChannelSelectorActionResult) => void>();
  const myWnd = io?.windows.my();

  const handler = useCallback(
    (
      action: ChannelSelectorAction,
      caller: IOConnectDesktop.Interop.Instance,
      sb: (args?: any) => void
    ) => {
      if (action.command === "will-show") {
        const init = async () => {
          setChannels([]);
          setIsLoading(true);
          const id = action.windowId;
          const channelInfo = action.channels;
          setVariant(action.variant);
          successCallback.current = sb;
          const window = io?.windows.findById(id);
          const windowChannel = await window?.getChannel();
          setWindowId(id);
          setChannels(getChannelProps(channelInfo, windowChannel));
          setIsLoading(false);
        };

        init().catch((err) => {
          setError(err);
          setIsLoading(false);
        });
      }
    },
    [io?.windows]
  );

  const onChannelSelected = useCallback(
    ({ name }: IOChannelSelector.ChannelInfo) => {
      const hideWindow = () => {
        return myWnd?.hide();
      };
      if (name.length === 0) {
        io?.channels.leave(windowId).finally(() => {
          void hideWindow();
        });
      } else {
        io?.channels.join(name, windowId).finally(() => {
          void hideWindow();
        });
      }
    },
    [io?.channels, myWnd, windowId]
  );

  useKeyDown(() => {
    void myWnd?.hide();
  }, ["Escape"]);

  useEffect(() => {
    const unClosing = myWnd?.onClosing(async (prevent) => {
      prevent({ showDialog: false });
      return Promise.resolve();
    });

    return unClosing;
  }, [myWnd]);

  useLayoutEffect(() => {
    if (refUl?.current && channels && channels.length > 0) {
      const { height, width, x, y } = refUl.current.getBoundingClientRect();
      if (successCallback.current && height > 0) {
        successCallback.current({ height, width, x, y });
      }
    }
  }, [channels, refUl]);

  useEffect(() => {
    const init = async () => {
      await io?.interop.registerAsync(methodName, handler);
    };
    void init();
    return () => {
      io?.interop.unregister(methodName);
    };
  }, [io?.interop, handler]);

  return {
    onChannelSelected: onChannelSelected,
    variant,
    isLoading,
    channels,
    error,
  };
}
