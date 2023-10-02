import { Dialog, useDialogsContext, SingleInputDialog } from "@interopio/components-react";
import { useEffect } from "react";
import LayoutModifiedDialog from "./Dialogs/LayoutModified";
import "@glue42/theme/dist/t42bootstrap.bundle.css";
import "./Dialogs/styles.css";

function DialogWrapper() {
  const { config, setResult } = useDialogsContext();

  useEffect(() => {
    document.title = config.title ?? "Dialog";
  }, [config.title]);

  const isLayoutModified = () => {
    if (
      typeof config.context === "object" &&
      config.context !== null &&
      "isLayoutModified" in config.context
    ) {
      return config.context.isLayoutModified;
    }
  };
  const shouldShowLayoutModifiedDialog =
    isLayoutModified() &&
    (config.operation === "systemShutdown" ||
      config.operation === "systemRestart");

  if (shouldShowLayoutModifiedDialog) {
    return <LayoutModifiedDialog config={config} setResult={setResult} />;
  } else if (config.type === "SingleInputDialog") {
    return <SingleInputDialog config={config} setResult={setResult} />;
  } else {
    return <Dialog config={config} setResult={setResult} />;
  }
}
export default DialogWrapper;
