import { useState, MouseEvent } from "react";
import { IODialogs, ButtonGroup } from "@interopio/components-react";

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
      <ButtonGroup align="right">
        <DialogButton
          id="save-changes"
          variant="primary"
          text="Save"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        />
        <DialogButton
          id="discard-changes"
          text="Discard"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        />
        <DialogButton
          id="go-back"
          text="Cancel"
          onClick={handleClick}
          onButtonFocused={handleFocusChanged}
          onBlur={handleFocusLoss}
        />
      </ButtonGroup>
    </DialogFooter>
  );

  return (
    <Dialog {...props} body={CustomDialogBody} footer={CustomDialogFooter} />
  );
}
export default ModifiedLayoutDialog;
