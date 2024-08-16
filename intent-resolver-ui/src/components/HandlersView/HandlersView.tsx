import React, { useContext, useEffect, useState } from "react";
import Search from "../Search/Search";
import { AppIntentHandler, Handlers, InstanceIntentHandler, ListProps } from "../../shared/types";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import { IOConnectDesktop } from "@interopio/desktop";
import InstancesList from "../InstancesList/InstancesList";
import AppsList from "../AppsList/AppsList";
import { Button, ButtonGroup, Checkbox } from "@interopio/components-react";
import { HandlersViewProps } from "./types";

const HandlersView = ({ callerName, intentName, setShowIntentList, handlers }: HandlersViewProps) => {    
    const io = useContext(IOConnectContext);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredHandlers, setFilteredHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [chosenIntentHandler, setChosenIntentHandler] = useState<IOConnectBrowser.Intents.ResolverIntentHandler | IOConnectDesktop.Intents.ResolverIntentHandler | undefined>(
        undefined
    );
    const [saveHandler, setSaveHandler] = useState<boolean>(false);

    useEffect(() => {
        const newFilteredApps = handlers.apps.filter(({ handler, intent }) => {
            if (!intentName) {
                return (handler.applicationTitle || handler.applicationName).toLowerCase().includes(searchQuery.toLowerCase());
            }

            const sameIntent = intentName && intentName === intent.intent;

            return sameIntent && (handler.applicationTitle || handler.applicationName).toLowerCase().includes(searchQuery.toLowerCase());
        });

        const newFilteredInstances = handlers.instances.filter(({ handler, intent }) => {
            if (!intentName) {
                return (handler.applicationTitle || handler.applicationName).toLowerCase().includes(searchQuery.toLowerCase());
            }

            const sameIntent = intentName && intentName === intent.intent;

            return sameIntent && (handler.applicationTitle || handler.applicationName).toLowerCase().includes(searchQuery.toLowerCase());
        });

        setFilteredHandlers({ apps: newFilteredApps, instances: newFilteredInstances });
    }, [searchQuery, handlers]);

    const handleSelectHandlerClick = (handler: InstanceIntentHandler | AppIntentHandler) => {
        if (!chosenIntentHandler) {
            setChosenIntentHandler(handler);
            return;
        }

        const instanceHandlerId = (handler as InstanceIntentHandler).instanceId;

        const sameInstanceAsChosenOne =
            (instanceHandlerId && instanceHandlerId === chosenIntentHandler.instanceId) ||
            (!instanceHandlerId && !chosenIntentHandler.instanceId && handler.applicationName === chosenIntentHandler.applicationName);

        setChosenIntentHandler(sameInstanceAsChosenOne ? undefined : handler);
    };

    const handleActionClick = () => {
        if (!chosenIntentHandler) {
            return;
        }

        return io.intents.resolver?.sendResponse(chosenIntentHandler as any, { saveHandler, intent: intentName });
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery((e.target as HTMLTextAreaElement).value);
    };

    const getListProps = (): ListProps => {
        return { intentName, filteredHandlers, chosenIntentHandler, handleSelectHandlerClick };
    };

    const getIntentName = () => {
        if (intentName) {
            return intentName;
        }

        return typeof io.intents.resolver?.intent === "string" ? io.intents.resolver?.intent : io.intents.resolver?.intent?.intent;
    };

    return (
        <>
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchQueryChange={handleSearchQueryChange} />
            <div className="io-intent-list-wrapper">
                <InstancesList {...getListProps()} />
                <AppsList {...getListProps()} />
            </div>
            <Checkbox label={`Always use this app for "${getIntentName()}" ${!!callerName ? `in "${callerName}"` : ""}`} onClick={(e) => setSaveHandler((e as any).target.checked)} />
            <ButtonGroup align="right" variant="fullwidth">
                {(io.intents.resolver as any)?.handlerFilter ? (
                    <Button text="Back" variant="link" onClick={() => setShowIntentList(true)} />
                ) : null}
                <Button disabled={!chosenIntentHandler} variant="primary" text="Action" onClick={handleActionClick} />
            </ButtonGroup>
        </>
    );
};

export default HandlersView;
