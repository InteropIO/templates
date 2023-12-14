import { IODownloadManager } from "@interopio/components-react";

const { DownloadManagerProvider, DownloadManager } = IODownloadManager;

function DownloadManagerWrapper() {
  return (
    <DownloadManagerProvider>
      <DownloadManagerInner />
    </DownloadManagerProvider>
  );
}

function DownloadManagerInner() {
  return <DownloadManager />;
}

export default DownloadManagerWrapper;
