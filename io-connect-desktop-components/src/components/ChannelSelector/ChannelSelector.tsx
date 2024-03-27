import { useEffect, useRef } from "react";
import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import { IOChannelSelector, ThemeProvider } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/channel-selector/styles.css";
import useChannels from "./useChannels";

const { ChannelSelector } = IOChannelSelector;

function ChannelSelectorInner() {
  const ref = useRef(null);
  const { channels, onChannelSelected, variant } = useChannels(ref);

  useEffect(() => {
    document.title = "Channels Selector";
  }, []);

  return (
    <ChannelSelector
      variant={variant}
      ref={ref}
      channels={channels ?? []}
      onChannelSelect={onChannelSelected}
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
