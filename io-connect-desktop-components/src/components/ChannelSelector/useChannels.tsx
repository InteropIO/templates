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
  channels: ChannelContextExtended[];
  variant: "single" | "directionalSingle";
}

interface ChannelSelectorActionResult {
  height: number;
  width: number;
  x: number;
  y: number;
}
interface ChannelContextExtended extends IOConnectDesktop.ChannelContext {
  isSelected?: boolean;
  read?: boolean;
  write?: boolean;
}

function getChannelProps(
  channelInfo: ChannelContextExtended[],
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
      write: c.write,
      read: c.read,
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
          successCallback.current = sb;
          setChannels([]);
          setIsLoading(true);
          const id = action.windowId;
          const channelInfo = action.channels;
          let isSelected = channelInfo.find((c) => c.isSelected);
          let selectedChannel = isSelected?.name;

          // Keep backward compatibility - io.CD sends isSelected as boolean
          if (typeof selectedChannel === "undefined") {
            const window = io?.windows.findById(id);
            const windowChannel = await window?.getChannel();
            selectedChannel = windowChannel;
          }

          setVariant(action.variant);
          setWindowId(id);
          setChannels(getChannelProps(channelInfo, selectedChannel));
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
    ({ name, read, write }: IOChannelSelector.ChannelInfo) => {
      const hideWindow = () => {
        if (variant === "directionalSingle") {
          return;
        }
        return myWnd?.hide();
      };
      const prevSelected = channels?.find((c) => c.isSelected)?.name;
      if (prevSelected === name) {
        io?.channels.leave(windowId).finally(() => {
          void hideWindow();
        });
      } else {
        io?.channels.join(name, windowId).finally(() => {
          void hideWindow();
        });
      }

      const channelsAPI = io?.channels as any;
      if (
        variant === "directionalSingle" &&
        typeof channelsAPI?.restrict === "function"
      ) {
        void channelsAPI?.restrict({ name, read, write, windowId });
      }

      setChannels((prev) => {
        if (!prev) {
          return prev;
        }
        return prev.map((c) => {
          if (prevSelected && c.name === prevSelected) {
            c.isSelected = false;
          } else {
            c.isSelected = c.name === name;
          }
          if (c.isSelected) {
            c.read = read;
            c.write = write;
          } else {
            c.read = false;
            c.write = false;
          }

          return c;
        });
      });
    },
    [io?.channels, channels, variant, myWnd, windowId]
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
