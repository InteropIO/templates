import { IODownloadManager, ThemeProvider } from "@interopio/components-react";
import { IOConnectProvider } from "@interopio/react-hooks";
import "@interopio/components-react/dist/styles/generic.css";
import "@interopio/components-react/dist/styles/components/ui/header.css";
import "@interopio/components-react/dist/styles/components/ui/footer.css";
import "@interopio/components-react/dist/styles/components/ui/block.css";
import "@interopio/components-react/dist/styles/components/ui/progress.css";
import "@interopio/components-react/dist/styles/features/download-manager/styles.css";

const { DownloadManagerProvider, DownloadManager } = IODownloadManager;

function DownloadManagerWrapper() {
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
