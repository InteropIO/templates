import {
  Dialog,
  DialogsProvider,
  useDialogsContext,
  SingleInputDialog,
} from "@interopio/components-react";
import { useEffect } from "react";
import LayoutModifiedDialog from "./Dialogs/LayoutModified";
import "@interopio/theme";
import "./Dialogs/styles.css";

function DialogsWrapper() {
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
    return (
      <DialogsProvider>
        <LayoutModifiedDialog config={config} setResult={setResult} />
      </DialogsProvider>
    );
  } else if (config.type === "SingleInputDialog") {
    return (
      <DialogsProvider>
        <SingleInputDialog config={config} setResult={setResult} />
      </DialogsProvider>
    );
  } else {
    return (
      <DialogsProvider>
        <Dialog config={config} setResult={setResult} />
      </DialogsProvider>
    );
  }
}
export default DialogsWrapper;
