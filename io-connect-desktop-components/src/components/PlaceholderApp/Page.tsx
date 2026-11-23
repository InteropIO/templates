import { IOConnectProvider } from "@interopio/react-hooks";
import API from "@interopio/desktop";
import { IOPlaceholderApp, ThemeProvider } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/placeholder-app/styles.css";

const { PlaceholderAppPage } = IOPlaceholderApp;

function PlaceholderAppWrapper() {
  return (
    <IOConnectProvider settings={{ desktop: { factory: API } }}>
      <ThemeProvider>
        <PlaceholderAppPage />
      </ThemeProvider>
    </IOConnectProvider>
  );
}

export default PlaceholderAppWrapper;
