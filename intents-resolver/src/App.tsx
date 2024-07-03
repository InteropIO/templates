import React, { useContext, useEffect, useState } from "react";
import "@interopio/theme";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import { useThemeSync } from "./hooks/useTheme";
import { Handlers, InstanceIntentHandler, ListProps } from "./shared/types";
import { NO_APP_WINDOW } from "./shared/constants";
import { Block, Panel, Title, Button, Checkbox } from "@interopio/components-react";
import Input from "./components/Input/Input";
import InstancesList from "./components/InstancesList/InstancesList";
import AppsList from "./components/AppsList/AppsList";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [handlers, setHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredHandlers, setFilteredHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [description, setDescription] = useState<string>("");
    const [callerName, setCallerName] = useState<string>("");
    const [intentName, setIntentName] = useState<string>("");
    const [chosenIntentHandler, setChosenIntentHandler] = useState<IOConnectBrowser.Intents.ResolverIntentHandler | undefined>(undefined);
    const [rememberChoice, setRememberChoice] = useState<boolean>(false);

    useThemeSync();

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

        // TODO: refactor this spaghetti
        const getTitle = async () => {
            const { handlersFilter, intent } = (io as any).intents.resolver;

            if (handlersFilter || !intent || typeof intent === "string") {
                const title = (io as any).intents.resolver?.getTitle();

                setDescription(title);

                return;
            }

            if (typeof intent === "object" && intent.description) {
                setDescription(intent.description);

                return;
            }

            const callerId = (io as any).intents.resolver?.callerId;

            const instance = io.interop.servers().find((server) => server.instance === callerId);

            const appName = instance?.application || instance?.applicationName;

            const inDesktop = (window as any).iodesktop || (window as any).glue42gd;
            const inBrowser = (window as any).iobrowser || (window as any).glue42core;

            if (inBrowser && instance?.application === "Platform") {
                setDescription(`"${intent.displayName || intent.intent}" action from "Platform" is unassigned. Choose an app to perform this action.`);

                setCallerName("Platform");
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            if (!appName || (inDesktop && appName === NO_APP_WINDOW)) {
                setDescription(`"${intent.displayName || intent.intent}" action is unassigned. Choose an app to perform this action.`);

                setCallerName(instance?.application || instance?.applicationName || instance?.instance || NO_APP_WINDOW);
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            const app = io.appManager.application(appName);

            if (!app) {
                setDescription(`"${intent.displayName || intent.intent}" action is unassigned. Choose an app to perform this action.`);

                setCallerName(instance?.application || instance?.applicationName || instance?.instance || NO_APP_WINDOW);
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            setDescription(`"${intent.displayName || intent.intent}" action from "${app.title || app.name}" is unassigned. Choose an app to perform this action.`);

            setCallerName(app.title || app.name);
            setIntentName(intent.displayName || intent.intent);
        };

        subscribeOnHandlerAdded();
        subscribeOnHandlerRemoved();
        getTitle();
    }, [io]);

    useEffect(() => {
        const newFilteredApps = handlers.apps.filter((app) => (app.applicationTitle || app.applicationName).toLowerCase().includes(searchQuery.toLowerCase()));
        const newFilteredInstances = handlers.instances.filter((inst) => (inst.applicationTitle || inst.applicationName).toLowerCase().includes(searchQuery.toLowerCase()));

        setFilteredHandlers({ apps: newFilteredApps, instances: newFilteredInstances });
    }, [searchQuery, handlers]);

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
        return { filteredHandlers, chosenIntentHandler, setChosenIntentHandler };
    };

    return (
        <Panel>
            <Panel.Header>
                <Title text="Intents Resolver" size="large" />
            </Panel.Header>
            <Panel.Body>
                <Block title={description} />
                <Input searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchQueryChange={handleSearchQueryChange} />
                <InstancesList {...getListProps()} />
                <AppsList {...getListProps()} />
                <Checkbox label={`Always use this app for "${intentName} in "${callerName}"`} onClick={(e) => setRememberChoice((e as any).target.checked)} />
                <Button disabled={!chosenIntentHandler} variant="primary" text="Action" onClick={handleActionClick} />
            </Panel.Body>
        </Panel>
    );
};

export default App;
