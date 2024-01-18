import { useEffect } from "react";
import { IODialogs } from "@interopio/components-react";
import LayoutModifiedDialog from "./LayoutModified";
import LayoutModifiedInput from "./LayoutModifiedInput";
import "@interopio/components-react/dist/styles/features/dialogs/styles.css";

const { DialogsProvider, useDialogsContext, Dialog, SingleInputDialog } =
  IODialogs;

function DialogsWrapper() {
  return (
    <DialogsProvider>
      <Dialogs />
    </DialogsProvider>
  );
}

function Dialogs() {
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

  const isLayoutModifiedInput = () => {
    if (
      typeof config.context === "object" &&
      config.context !== null &&
      "isLayoutModified" in config.context && "inputRequested" in config.context
    ) {
      return config.context.inputRequested;
    }
  };

  const operationCheck = () => {
    return (config.operation === "systemShutdown" || config.operation === "systemRestart" || config.operation === "layoutRestore") ? true : false;
  };

  const shouldShowLayoutModifiedDialog = isLayoutModified() && operationCheck();

  const shouldShowLayoutModifiedInputDialog = isLayoutModifiedInput() && operationCheck();

  if (shouldShowLayoutModifiedInputDialog) {
    return <LayoutModifiedInput config={config} setResult={setResult} />;
  } else if (shouldShowLayoutModifiedDialog) {
    return <LayoutModifiedDialog config={config} setResult={setResult} />;
  } else if (config.type === "SingleInputDialog") {
    return <SingleInputDialog config={config} setResult={setResult} />;
  } else {
    return <Dialog config={config} setResult={setResult} />;
  }
}

export default DialogsWrapper;
