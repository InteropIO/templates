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
    const [rememberChoice, setRememberChoice] = useState<boolean>(false);

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

        return io.intents.resolver?.sendResponse({
            intent:
                intentName || io.intents.resolver.handlerFilter?.intent || typeof (io as any).intents.resolver.intent === "string"
                    ? (io as any).intents.resolver.intent
                    : (io as any).intents.resolver.intent.intent,
            handler: chosenIntentHandler,
            rememberChoice,
        });
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
            <InstancesList {...getListProps()} />
            <AppsList {...getListProps()} />
            <Checkbox label={`Always use this app for "${getIntentName()}" in "${callerName}"`} onClick={(e) => setRememberChoice((e as any).target.checked)} />
            <ButtonGroup align="right">
                {io.intents.resolver?.handlerFilter ? <Button variant="outline" text="Back" onClick={() => setShowIntentList(true)} /> : null}
                <Button disabled={!chosenIntentHandler} variant="primary" text="Action" onClick={handleActionClick} />
            </ButtonGroup>
        </>
    );
};

export default HandlersView;
