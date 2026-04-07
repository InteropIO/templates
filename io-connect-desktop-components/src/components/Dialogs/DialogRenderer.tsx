import { IODialogs, IODialogTemplates } from "@interopio/components-react";
import "./DialogRenderer.css";

const { DialogRenderer } = IODialogs;
const { DEFAULT_DIALOG_TEMPLATES } = IODialogTemplates;

function DialogRendererWrapper() {
  return (
    <DialogRenderer
      messagePort={(window as any).glue42dialog}
      templates={DEFAULT_DIALOG_TEMPLATES}
    />
  );
}

export default DialogRendererWrapper;
