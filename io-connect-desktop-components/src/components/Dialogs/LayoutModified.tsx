import { useState, MouseEvent, useMemo } from "react";
import { IODialogs, ButtonGroup } from "@interopio/components-react";

type LayoutModifiedProps = Pick<IODialogs.DialogProps, "setResult" | "config">;

const { Dialog, DialogBody, DialogButton, DialogFooter } = IODialogs;

const BUTTON_CONFIGS = [
  {
    id: "save-changes",
    variant: "primary" as const,
    text: "Save",
  },
  {
    id: "discard-changes",
    text: "Discard",
  },
  {
    id: "go-back",
    text: "Cancel",
  },
];

function LayoutModified({ config, setResult }: Readonly<LayoutModifiedProps>) {
  const [focusedButton, setFocusedButton] = useState("save-changes");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setResult({ action: "clicked", button: focusedButton });
  };

  const handleFocusLoss = () => {
    handleFocusChanged("");
  };

  const handleFocusChanged = (action: string) => {
    setFocusedButton(action);
  };

  const LayoutModifiedDialogBody = useMemo(
    () => (
      <DialogBody>
        <div>
          <h1>The Layout has been modified</h1>
          <p>Do you want to save or discard the changes before closing?</p>
        </div>
      </DialogBody>
    ),
    []
  );

  const LayoutModifiedDialogFooter = (
    <DialogFooter>
      <ButtonGroup align="right">
        {BUTTON_CONFIGS.map((buttonConfig) => (
          <DialogButton
            key={buttonConfig.id}
            id={buttonConfig.id}
            variant={buttonConfig.variant}
            text={buttonConfig.text}
            onClick={handleClick}
            onButtonFocused={handleFocusChanged}
            onBlur={handleFocusLoss}
          />
        ))}
      </ButtonGroup>
    </DialogFooter>
  );

  return (
    <Dialog
      config={config}
      setResult={setResult}
      body={LayoutModifiedDialogBody}
      footer={LayoutModifiedDialogFooter}
    />
  );
}
export default LayoutModified;
