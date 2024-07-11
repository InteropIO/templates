import { Button, ButtonGroup, List } from "@interopio/components-react";
import React from "react";
import { IntentsViewProps } from "./types";

const IntentsView = ({ chosenIntentName, handleSelectIntentClick, setShowIntentList, methodsForFilter }: IntentsViewProps) => {
    return (
        <>
            <List checkIcon="check" variant="single">
                {Array.from(new Set(methodsForFilter.map((method) => method.intent))).map((methodName) => (
                    <List.Item key={methodName} onClick={() => handleSelectIntentClick(methodName)} isSelected={methodName === chosenIntentName}>
                        {methodName}
                    </List.Item>
                ))}
            </List>
            <ButtonGroup align="right">
                <Button disabled={!chosenIntentName} variant="primary" text="Next" onClick={() => setShowIntentList(false)} />
            </ButtonGroup>
        </>
    );
};

export default IntentsView;
