import { IOChannelSelector, ThemeProvider } from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import { useEffect } from "react";
import "@interopio/components-react/dist/styles/features/channel-selector/styles.css";

const { ChannelSelector } = IOChannelSelector;

function ChannelSelectorWrapper() {
  useEffect(() => {
    document.title = "Channels Selector";
  }, []);
  return (
    <IOConnectProvider
      settings={{ desktop: { factory: API, config: { channels: true } } }}
    >
      <ThemeProvider>
        <ChannelSelector />
      </ThemeProvider>
    </IOConnectProvider>
  );
}

export default ChannelSelectorWrapper;
