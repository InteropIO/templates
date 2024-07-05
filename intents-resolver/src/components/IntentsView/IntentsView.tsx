import { IOConnectBrowser } from "@interopio/browser";
import { Button, ButtonGroup, List } from "@interopio/components-react";
import { IOConnectContext } from "@interopio/react-hooks";
import React, { useContext, useEffect, useState } from "react";
import { IntentsViewProps } from "./types";

const IntentsView = ({ chosenIntentName, handleSelectIntentClick, setShowIntentList }: IntentsViewProps) => {
    const io = useContext(IOConnectContext);

    const [methodsForFilter, setMethodsForFilter] = useState<IOConnectBrowser.Intents.IntentInfo[]>([]);

    useEffect(() => {
        let unOnIntentAdded: () => void;
        let unOnIntentRemoved: () => void;

        const retrieveMethodsForFilter = async () => {
            const handlerFilter: IOConnectBrowser.Intents.HandlerFilter = (io as any).intents.resolver.handlerFilter;

            if (!handlerFilter) {
                return;
            }

            unOnIntentAdded = (io as any).intents.resolver.onIntentAdded((intent: IOConnectBrowser.Intents.IntentInfo) => {
                setMethodsForFilter((methods) => methods.concat([intent]));
            });

            unOnIntentRemoved = (io as any).intents.resolver.onIntentRemoved((intent: IOConnectBrowser.Intents.IntentInfo) => {
                setMethodsForFilter((methods) =>
                    methods.filter((method: IOConnectBrowser.Intents.IntentInfo) => (method.displayName || method.intent) !== (intent.displayName || intent.intent))
                );
            });
        };

        retrieveMethodsForFilter();

        return () => {
            unOnIntentAdded();
            unOnIntentRemoved();
        };
    }, [io]);

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
