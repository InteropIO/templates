import React, { useContext, useEffect, useState } from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import { useThemeSync } from "./hooks/useTheme";
import { AppIntentHandler, Handlers, InstanceIntentHandler } from "./shared/types";
import "@interopio/theme";
import "./App.css";
import { NO_APP_WINDOW } from "./shared/constants";
import { Block, Input, List, Panel, Title, Button, Dropdown, Checkbox } from "@interopio/components-react";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [handlers, setHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [description, setDescription] = useState<string>("");

    const [callerName, setCallerName] = useState<string>("");
    const [intentName, setIntentName] = useState<string>("");

    const [chosenIntentHandler, setChosenIntentHandler] = useState<
        IOConnectBrowser.Intents.ResolverIntentHandler | undefined
    >(undefined);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    useThemeSync();

    useEffect(() => {
        const subscribeOnHandlerAdded = () => {
            return io.intents.resolver?.onHandlerAdded((handler: IOConnectBrowser.Intents.ResolverIntentHandler) => {
                const isInstance = handler.instanceId;

                if (isInstance) {
                    const isFirstOpenInstance = handlers.instances.find(
                        (inst) => inst.applicationName === handler.applicationName
                    );

                    if (isFirstOpenInstance) {
                        setHandlers((handlers) => {
                            return {
                                apps: handlers.apps,
                                instances: [
                                    ...handlers.instances,
                                    { ...handler, id: handler.instanceId } as InstanceIntentHandler,
                                ],
                            };
                        });

                        return;
                    }
                }

                const handlerWithId = { ...handler, id: isInstance ? handler.instanceId : handler.applicationName };

                const updateValue = handler.instanceId ? "instances" : "apps";

                setHandlers((handlers) => ({ ...handlers, [updateValue]: [...handlers[updateValue], handlerWithId] }));
            });
        };

        const subscribeOnHandlerRemoved = () => {
            return io.intents.resolver?.onHandlerRemoved(
                (removedHandler: IOConnectBrowser.Intents.ResolverIntentHandler) => {
                    const updateValue = removedHandler.instanceId ? "instances" : "apps";

                    setHandlers((handlers) => ({
                        ...handlers,
                        [updateValue]: handlers[updateValue].filter((handler) =>
                            removedHandler.instanceId
                                ? handler.id !== removedHandler.instanceId
                                : handler.applicationName !== removedHandler.applicationName
                        ),
                    }));
                }
            );
        };

        const getTitle = async () => {
            const { handlersFilter, intent } = (io as any).intents.resolver;

            // TODO: think of callerName and intent/filter for Remember me functionality
            if (handlersFilter || !intent || typeof intent === "string") {
                const title = (io as any).intents.resolver?.getTitle();

                setDescription(title);

                return;
            }

            // TODO: think of callerName and intent/filter for Remember me functionality
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
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action from "Platform" is unassigned. Choose an app to perform this action.`
                );

                setCallerName("Platform");
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            if (!appName || (inDesktop && appName === NO_APP_WINDOW)) {
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action is unassigned. Choose an app to perform this action.`
                );

                setCallerName(
                    instance?.application ?? instance?.applicationName ?? instance?.instance ?? NO_APP_WINDOW
                );
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            const app = io.appManager.application(appName);

            if (!app) {
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action is unassigned. Choose an app to perform this action.`
                );

                setCallerName(
                    instance?.application ?? instance?.applicationName ?? instance?.instance ?? NO_APP_WINDOW
                );
                setIntentName(intent.displayName || intent.intent);

                return;
            }

            setDescription(
                `"${intent.displayName || intent.intent}" action from "${
                    app.title || app.name
                }" is unassigned. Choose an app to perform this action.`
            );

            setCallerName(app.title ?? app.name);
            setIntentName(intent.displayName || intent.intent);
        };

        subscribeOnHandlerAdded();
        subscribeOnHandlerRemoved();
        getTitle();
    }, [io]);

    const handleActionClick = () => {
        if (!chosenIntentHandler) {
            setError(`Choose an app to handle ${intentName}`);
            return;
        }

        setError("");

        return io.intents.resolver?.sendResponse(chosenIntentHandler, { rememberChoice: rememberMe });
    };

    const groupInstances = (handlers: InstanceIntentHandler[]): { [app: string]: InstanceIntentHandler[] } => {
        let groupedInstances: { [appName: string]: InstanceIntentHandler[] } = {};

        handlers.forEach((handler) => {
            const app = handler.applicationTitle ?? handler.applicationName;

            if (groupedInstances[app]?.length) {
                groupedInstances[app].push(handler);
                return;
            }

            groupedInstances[app] = [handler];
        });

        return groupedInstances;
    };

    return (
        <Panel>
            <Panel.Header>
                <Title text="Intents Resolver" size="large" />
            </Panel.Header>
            <Panel.Body>
                <Block title={description} />
                <Input id="input-prepend" placeholder="Filter apps" iconPrepend="search" />
                <List checkIcon="check" variant="single" className="io-list">
                    {handlers.instances.length ? (
                        <>
                            <List.ItemSection>Open apps</List.ItemSection>
                            {Object.entries(groupInstances(handlers.instances)).map(([app, instances]) => (
                                <List.Item
                                    key={app}
                                    onClick={() => setChosenIntentHandler(handlers.instances[0])}
                                    append={
                                        instances.length > 1 ? (
                                            <Dropdown variant="outline">
                                                <Dropdown.Button icon="chevron-down">App Instances</Dropdown.Button>
                                                <Dropdown.Content>
                                                    <List>
                                                        {instances.map((handler) => (
                                                            <List.Item onClick={() => setChosenIntentHandler(handler)}>
                                                                {handler.applicationTitle ??
                                                                    handler.applicationName ??
                                                                    handler.instanceId}
                                                                ({handler.instanceId})
                                                            </List.Item>
                                                        ))}
                                                    </List>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        ) : null
                                    }
                                >
                                    {app}
                                </List.Item>
                            ))}
                        </>
                    ) : null}
                </List>
                <List checkIcon="check" variant="single" className="io-list">
                    {handlers.apps.length ? (
                        <>
                            <List.ItemSection>All Available Apps</List.ItemSection>
                            {handlers.apps.map((appHandler: AppIntentHandler) => (
                                <List.Item key={appHandler.id} onClick={() => setChosenIntentHandler(appHandler)}>
                                    {appHandler.applicationTitle ?? appHandler.applicationName}
                                </List.Item>
                            ))}
                        </>
                    ) : null}
                </List>
                <Checkbox
                    label={`Always use this app for "${intentName} in "${callerName}"`}
                    onClick={(e) => setRememberMe((e as any).target.checked)}
                />
                {error ? <div style={{ color: "red" }}>{error}</div> : null}
                <Button variant="primary" text="Action" onClick={handleActionClick} />
            </Panel.Body>
        </Panel>
    );
};

export default App;
