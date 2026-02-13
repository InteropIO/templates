import { IODownloadManager, ThemeProvider } from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import "@interopio/components-react/dist/styles/features/download-manager/styles.css";

const { DownloadManagerProvider, DownloadManager } = IODownloadManager;

function DownloadManagerWrapper() {
  return (
    <IOConnectProvider settings={{}}>
      <ThemeProvider>
        <DownloadManagerProvider>
          <DownloadManager />
        </DownloadManagerProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

export default DownloadManagerWrapper;
