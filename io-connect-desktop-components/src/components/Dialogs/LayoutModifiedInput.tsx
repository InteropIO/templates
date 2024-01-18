import { useState, MouseEvent, useCallback } from "react";
import { ButtonGroup, TextInputComponent, Toggle } from "@interopio/components-react";
import { IODialogs } from "@interopio/components-react";

const { Dialog, DialogBody, DialogButton, DialogFooter } = IODialogs;

function LayoutModifiedInput(props: IODialogs.DialogProps) {

    const { setResult } = props;
    const [focusedButton, setFocusedButton] = useState("save-changes");
    const [input, setInput] = useState("");
    const [isDefault, setDefault] = useState(true);
    const [showInput, setShowInput] = useState(false);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (focusedButton === "save-changes" && !showInput) {
            setShowInput(true);
            return;
        }
        setResult({ action: "clicked", button: focusedButton, value: { name: input, isDefault } });
    };

    const handleInput = (value: string): boolean => {
        if (!value) {
            return false;
        }
        setInput(value);
        return true;
    }

    const handleSwitchInput = () => {
        setDefault(!isDefault);
    }

    const handleFocusLoss = () => {
        handleFocusChanged("");
    };

    const handleFocusChanged = (action: string) => {
        setFocusedButton(action);
    };

    const executeDefaultAction = useCallback(() => {
        setResult({
            action: "clicked",
            button: focusedButton,
            value: input,
        });
    }, [focusedButton, input, setResult]);

    const layoutModifiedPromptBody = (
        <DialogBody>
            <p>You have unsaved layout changes.</p>
            <p>Do you want to save them before closing?</p>
        </DialogBody>
    );

    const layoutModifiedInputBody = (
        <DialogBody>
            <div className="io-dialog-content">
                <p>Please enter a name for the layout:</p>
            </div>
            <form>
                <TextInputComponent
                    placeHolder='e.g. "Default"'
                    onEnterKeyDown={executeDefaultAction}
                    onInput={handleInput}>
                </TextInputComponent>
                <Toggle
                    checked={isDefault}
                    label="Set as Default?"
                    onChange={handleSwitchInput}
                ></Toggle>
            </form>
        </DialogBody>
    )

    const CustomDialogBody = (showInput ? layoutModifiedInputBody : layoutModifiedPromptBody);

    const CustomDialogFooter = (
        <DialogFooter>
            <ButtonGroup fullwidth={true}>
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
                    color="default"
                    onClick={handleClick}
                    onButtonFocused={handleFocusChanged}
                    onBlur={handleFocusLoss}
                >
                    Discard changes
                </DialogButton>
                <DialogButton
                    id="go-back"
                    color="default"
                    onClick={handleClick}
                    onButtonFocused={handleFocusChanged}
                    onBlur={handleFocusLoss}
                >
                    Go back
                </DialogButton>
            </ButtonGroup>
        </DialogFooter>
    );
    return (
        <Dialog {...props} body={CustomDialogBody} footer={CustomDialogFooter} />
    );
}
export default LayoutModifiedInput;
