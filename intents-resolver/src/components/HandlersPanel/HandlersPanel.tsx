import React, { useContext, useEffect, useState } from "react";
import Input from "../Input/Input";
import { AppIntentHandler, Handlers, InstanceIntentHandler, ListProps } from "../../shared/types";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import InstancesList from "../InstancesList/InstancesList";
import AppsList from "../AppsList/AppsList";
import { Button, Checkbox } from "@interopio/components-react";
import { HandlersPanelProps } from "./types";

const HandlersPanel = ({ callerName, intentName }: HandlersPanelProps) => {
    const io = useContext(IOConnectContext);

    const [handlers, setHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredHandlers, setFilteredHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [chosenIntentHandler, setChosenIntentHandler] = useState<IOConnectBrowser.Intents.ResolverIntentHandler | undefined>(undefined);
    const [rememberChoice, setRememberChoice] = useState<boolean>(false);

    useEffect(() => {
        const subscribeOnHandlerAdded = () => {
            return io.intents.resolver?.onHandlerAdded((handler: IOConnectBrowser.Intents.ResolverIntentHandler) => {                
                const isInstance = handler.instanceId;
                const isFirstOpenInstance = handlers.instances.find((inst) => inst.applicationName === handler.applicationName);

                if (isInstance && isFirstOpenInstance) {
                    setHandlers((handlers) => ({
                        apps: handlers.apps,
                        instances: [...handlers.instances, { ...handler, id: handler.instanceId } as InstanceIntentHandler],
                    }));

                    return;
                }

                const handlerWithId = { ...handler, id: isInstance ? handler.instanceId : handler.applicationName };

                const updateValue = handler.instanceId ? "instances" : "apps";

                setHandlers((handlers) => ({ ...handlers, [updateValue]: [...handlers[updateValue], handlerWithId] }));
            });
        };

        const subscribeOnHandlerRemoved = () => {
            return io.intents.resolver?.onHandlerRemoved((removedHandler: IOConnectBrowser.Intents.ResolverIntentHandler) => {
                const updateValue = removedHandler.instanceId ? "instances" : "apps";

                setHandlers((handlers) => ({
                    ...handlers,
                    [updateValue]: handlers[updateValue].filter((handler) =>
                        removedHandler.instanceId ? handler.id !== removedHandler.instanceId : handler.applicationName !== removedHandler.applicationName
                    ),
                }));
            });
        };

        subscribeOnHandlerAdded();
        subscribeOnHandlerRemoved();
        // getTitle();
    }, [io]);

    useEffect(() => {
        const newFilteredApps = handlers.apps.filter((app) => (app.applicationTitle || app.applicationName).toLowerCase().includes(searchQuery.toLowerCase()));
        const newFilteredInstances = handlers.instances.filter((inst) => (inst.applicationTitle || inst.applicationName).toLowerCase().includes(searchQuery.toLowerCase()));

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

        // TODO: add `intent` when filter handlers is passed
        return io.intents.resolver?.sendResponse({ intent: intentName, handler: chosenIntentHandler, rememberChoice });
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery((e.target as HTMLTextAreaElement).value);
    };

    const getListProps = (): ListProps => {
        return { filteredHandlers, chosenIntentHandler, handleSelectHandlerClick };
    };

    return (
        <>
            <Input searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchQueryChange={handleSearchQueryChange} />
            <InstancesList {...getListProps()} />
            <AppsList {...getListProps()} />
            <Checkbox label={`Always use this app for "${intentName} in "${callerName}"`} onClick={(e) => setRememberChoice((e as any).target.checked)} />
            <Button disabled={!chosenIntentHandler} variant="primary" text="Action" onClick={handleActionClick} />
        </>
    );
};

export default HandlersPanel;
