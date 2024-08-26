import { Button, ButtonGroup, List } from "@interopio/components-react";
import React, { useEffect } from "react";
import { IntentsViewProps } from "./types";

const IntentsView = ({ chosenIntentName, handleSelectIntentClick, setShowIntentList, intentsForFilter }: IntentsViewProps) => {
    useEffect(() => {
        const allIntentNames = Array.from(new Set(intentsForFilter.map((intent) => intent.intent)));

        if (allIntentNames.length > 1) {
            return;
        }

        const intentName = allIntentNames[0];

        handleSelectIntentClick(intentName);

        setShowIntentList(false);
    }, [])
    
    return (
        <>
            <div className="io-intent-list-wrapper">
                <List checkIcon="check" variant="single">
                    {Array.from(new Set(intentsForFilter.map((method) => method.intent))).map((methodName) => (
                        <List.Item key={methodName} onClick={() => handleSelectIntentClick(methodName)} isSelected={methodName === chosenIntentName}>
                            {methodName}
                        </List.Item>
                    ))}
                </List>
            </div>
            <ButtonGroup align="right" variant="fullwidth">
                <Button disabled={!chosenIntentName} variant="primary" text="Next" onClick={() => setShowIntentList(false)} />
            </ButtonGroup>
        </>
    );
};

export default IntentsView;
