import { useEffect } from "react";
import { IODownloadManager, ThemeProvider } from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import "@interopio/components-react/dist/styles/features/download-manager/styles.css";

const { DownloadManagerProvider, DownloadManager } = IODownloadManager;

function DownloadManagerWrapper() {
  useEffect(() => {
    document.title = "Download Manager";
  }, []);

  return (
    <IOConnectProvider settings={{}}>
      <ThemeProvider>
        <DownloadManagerProvider>
          <DownloadManagerInner />
        </DownloadManagerProvider>
      </ThemeProvider>
    </IOConnectProvider>
  );
}

function DownloadManagerInner() {
  return <DownloadManager />;
}

export default DownloadManagerWrapper;
