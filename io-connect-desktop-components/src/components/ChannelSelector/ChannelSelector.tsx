import { useEffect, useRef } from "react";
import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import { IOChannelSelector, ThemeProvider } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/channel-selector/styles.css";

const { ChannelSelector, useIOCDChannels } = IOChannelSelector;

function ChannelSelectorInner() {
  const ref = useRef(null);
  const {
    variant,
    channels,
    restrictedChannels,
    onChannelSelected,
    onChannelRestricted,
  } = useIOCDChannels(ref);

  return (
    <ChannelSelector
      variant={variant}
      ref={ref}
      channels={channels ?? []}
      restrictedChannels={restrictedChannels ?? []}
      onChannelSelect={onChannelSelected}
      onChannelRestrict={onChannelRestricted}
    />
  );
}

function ChannelSelectorWrapper() {
  useEffect(() => {
    document.title = "Channels Selector";
  }, []);
  return (
    <IOConnectProvider
      settings={{ desktop: { factory: API, config: { channels: true } } }}
    >
      <ThemeProvider>
        <ChannelSelectorInner />
      </ThemeProvider>
    </IOConnectProvider>
  );
}

export default ChannelSelectorWrapper;
