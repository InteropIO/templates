import { IODialogs } from "@interopio/components-react";
import DialogRenderer from "./DialogRenderer";
import LayoutModifiedDialog from "./LayoutModified";
import "@interopio/components-react/dist/styles/features/dialogs/styles.css";

const { DialogsProvider, useDialogsContext, Dialog, SingleInputDialog } = IODialogs;

const CONFIG_OPERATIONS = ["systemShutdown", "systemRestart", "layoutRestore"];

function DialogsWrapper() {
  return (
    <DialogsProvider>
      <Dialogs />
    </DialogsProvider>
  );
}

function Dialogs() {
  const { config, setResult } = useDialogsContext();
  const { operation = "", context = {}, type } = config;

  const shouldShowTemplateDialog = config.operation === "requestDialog";

  if (shouldShowTemplateDialog) {
    return <DialogRenderer />;
  }

  const isLayoutModified = Boolean((context as any).isLayoutModified);

  const shouldShowLayoutModifiedDialog = isLayoutModified && CONFIG_OPERATIONS.includes(operation);

  if (shouldShowLayoutModifiedDialog) {
    return <LayoutModifiedDialog config={config} setResult={setResult} />;
  }

  if (type === "SingleInputDialog") {
    return <SingleInputDialog config={config} setResult={setResult} />;
  }

  return <Dialog config={config} setResult={setResult} />;
}

export default DialogsWrapper;
