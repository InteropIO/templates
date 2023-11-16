import { useState, MouseEvent } from "react";
import {
  Dialog,
  DialogBody,
  DialogButton,
  DialogFooter,
  DialogProps,
} from "@interopio/components-react";

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
    <DialogBody>
      <p>You have unsaved layout changes.</p>
      <p>Do you want to save them before closing?</p>
    </DialogBody>
  );

  const CustomDialogFooter = (
    <DialogFooter style={{ textAlign: "left" }}>
      <div className="modal-footer-btns">
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
      </div>
    </DialogFooter>
  );
  return (
    <Dialog {...props} body={CustomDialogBody} footer={CustomDialogFooter} />
  );
}
export default ModifiedLayoutDialog;
