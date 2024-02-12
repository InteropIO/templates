import { useState, MouseEvent } from "react";
import { IODialogs } from "@interopio/components-react";

const { Dialog, DialogBody, DialogButton, DialogFooter } = IODialogs;

function ModifiedLayoutDialog(props: IODialogs.DialogProps) {
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
      <p>
        The Layout has been modified. Do you want to save or discard the changes
        before closing?
      </p>
    </DialogBody>
  );

  const CustomDialogFooter = (
    <DialogFooter>
      <div className="io-btn-group io-btn-group-fullwidth">
        <DialogButton
          id="go-back"
          color="default"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        >
          Cancel
        </DialogButton>
        <DialogButton
          id="discard-changes"
          color="default"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        >
          Discard
        </DialogButton>
        <DialogButton
          id="save-changes"
          color="primary"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        >
          Save
        </DialogButton>
      </div>
    </DialogFooter>
  );

  return (
    <Dialog {...props} body={CustomDialogBody} footer={CustomDialogFooter} />
  );
}
export default ModifiedLayoutDialog;
