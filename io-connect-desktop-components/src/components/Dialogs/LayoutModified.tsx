import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogFooter,
  DialogProps,
} from "@interopio/components-react";
import { useState, MouseEvent } from "react";

function ModifiedLayoutDialog(props: DialogProps) {
  const { setResult } = props;
  const [focusedButton, setFocusedButton] = useState("save-changes");

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResult({ action: "clicked", button: focusedButton });
  };

  const handleFocusLoss = () => {
    handleFocusChanged("");
  };

  const handleFocusChanged = (action: string) => {
    setFocusedButton(action);
  };

  const CustomDialogBody = (
    <DialogBody style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <p style={{ marginBottom: "0.5em" }}>You have unsaved layout changes.</p>
      <p style={{ marginBottom: "0.5em" }}>
        Do you want to save them before closing?
      </p>
    </DialogBody>
  );

  const CustomDialogFooter = (
    <DialogFooter style={{ justifyContent: "flex-start" }}>
      <DialogButton
        id="save-changes"
        color="primary"
        onClick={handleClick}
        onButtonFocused={handleFocusChanged}
        onBlur={handleFocusLoss}
      >
        Save changes
      </DialogButton>
      <DialogButton
        id="discard-changes"
        color="secondary"
        onClick={handleClick}
        onButtonFocused={handleFocusChanged}
        onBlur={handleFocusLoss}
      >
        Discard changes
      </DialogButton>
      <DialogButton
        id="go-back"
        color="link"
        onClick={handleClick}
        onButtonFocused={handleFocusChanged}
        onBlur={handleFocusLoss}
      >
        Go back
      </DialogButton>
    </DialogFooter>
  );
  return (
    <Dialog {...props} body={CustomDialogBody} footer={CustomDialogFooter} />
  );
}
export default ModifiedLayoutDialog;
