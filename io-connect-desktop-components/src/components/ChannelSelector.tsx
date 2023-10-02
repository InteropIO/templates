import { ChannelSelector, ThemeProvider } from "@interopio/components-react";
import { GlueProvider } from "@glue42/react-hooks";
import Glue from "@glue42/desktop";
import { useEffect } from "react";

function ChannelsSelectorWrapper() {
  useEffect(() => {
    document.title = "Channels Selector";
  }, []);
  return (
    <GlueProvider
      settings={{ desktop: { factory: Glue, config: { channels: true } } }}
    >
      <ThemeProvider>
        <ChannelSelector />
      </ThemeProvider>
    </GlueProvider>
  );
}
export default ChannelsSelectorWrapper;
