import React, { useContext, useEffect, useState } from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import { useThemeSync } from "./hooks/useTheme";
import { Handler } from "./shared/types";
import "@interopio/theme";
import "./App.css";
import { NO_APP_WINDOW } from "./shared/constants";
import { Block, Input, List, Panel, Title, Icon } from "@interopio/components-react";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [handlers, setHandlers] = useState<Handler[]>([]);
    const [description, setDescription] = useState<string>("");

    useThemeSync();

    useEffect(() => {
        const setWindowBounds = async (): Promise<void> => {
            const html = document.querySelector("html");

            if (!html) {
                return;
            }

            const height = html.getBoundingClientRect().height;

            if (height > 800) {
                return;
            }

            const myWin = io.windows.my();

            if (!myWin) {
                return;
            }

            const inBrowser = (window as any).glue42core || (window as any).iobrowser;

            if (inBrowser) {
                await myWin.moveResize({ height: height + 100, width: 400 });

                return;
            }

            await myWin.resizeTo(undefined, height + 50);
        };

        setWindowBounds();
    }, [handlers]);

    useEffect(() => {
        const subscribeOnHandlerAdded = () => {
            return io.intents.resolver?.onHandlerAdded((handler) => {
                setHandlers((handlers) => {
                    const parsedHandler = {
                        ...handler,
                        id: handler.instanceId || handler.applicationName,
                        title: (handler as any).applicationTitle,
                    };

                    return [...handlers, parsedHandler];
                });
            });
        };

        const subscribeOnHandlerRemoved = () => {
            return io.intents.resolver?.onHandlerRemoved(
                (removedHandler: IOConnectBrowser.Intents.ResolverIntentHandler) => {
                    setHandlers((handlers) => {
                        const removedHandlerWithId = {
                            ...removedHandler,
                            id: removedHandler.instanceId ? removedHandler.instanceId : removedHandler.applicationName,
                        };

                        return handlers.filter((handler) => handler.id !== removedHandlerWithId.id);
                    });
                }
            );
        };

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
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action from "Platform" is unassigned. Choose an app to perform this action.`
                );

                return;
            }

            if (!appName || (inDesktop && appName === NO_APP_WINDOW)) {
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action is unassigned. Choose an app to perform this action.`
                );

                return;
            }

            const app = io.appManager.application(appName);

            if (!app) {
                console.log("THEEREEE");
                setDescription(
                    `"${
                        intent.displayName || intent.intent
                    }" action is unassigned. Choose an app to perform this action.`
                );

                return;
            }

            setDescription(
                `"${intent.displayName || intent.intent}" action from "${
                    app.title || app.name
                }" is unassigned. Choose an app to perform this action.`
            );
        };

        subscribeOnHandlerAdded();
        subscribeOnHandlerRemoved();
        getTitle();
    }, []);

    return (
        <>
            <Panel>
                <Panel.Header>
                    <Title text="Intents Resolver" size="large" />
                </Panel.Header>
                <Panel.Body>
                    <Block title={description} />
                    <Input id="input-prepend" placeholder="Filter apps" iconPrepend="search" />
                    <List>
                        <List.ItemSection>Open apps</List.ItemSection>
                        {handlers.map((handler) => (
                            <List.Item id={handler.id} prepend={<Icon variant="application" />}>
                                {handler.applicationTitle ?? handler.applicationName}
                            </List.Item>
                        ))}
                    </List>
                </Panel.Body>
            </Panel>
        </>
    );
};

export default App;
