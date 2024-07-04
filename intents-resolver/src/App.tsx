import React, { useContext, useEffect, useState } from "react";
import "@interopio/theme";
import { Block, Button, List, Panel, Title } from "@interopio/components-react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import HandlersPanel from "./components/HandlersPanel/HandlersPanel";
import { NO_APP_WINDOW } from "./shared/constants";
import { useThemeSync } from "./hooks/useTheme";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [description, setDescription] = useState<string>("");
    const [methodsForFilter, setMethodsForFilter] = useState<IOConnectBrowser.Intents.IntentInfo[]>([]);
    const [chosenIntentName, setChosenIntentName] = useState<string>("");
    const [callerName, setCallerName] = useState<string>("");

    useThemeSync();

    useEffect(() => {
        const getTitle = ({ contextTypes, resultType, applicationNames }: IOConnectBrowser.Intents.HandlerFilter) => {
            const title: string | undefined = (io as any).intents.resolver?.getTitle();

            if (title) {
                setDescription(title);

                return;
            }

            const contextTypesString = contextTypes?.length ? `${contextTypes.join(", ")} contexts` : "";
            const applicationNamesString = applicationNames?.length ? `${applicationNames.join(", ")} apps` : "";

            const description = `Choose action for ${contextTypesString}${contextTypesString ? "and" : ""}${resultType ? `'${resultType}' result type` : ""}${
                resultType && applicationNamesString ? "and" : ""
            }${applicationNamesString ? `'${applicationNamesString}' applications` : ""}`;

            setDescription(description);
        };

        const retrieveMethodsForFilter = async () => {
            const handlerFilter: IOConnectBrowser.Intents.HandlerFilter = (io as any).intents.resolver.handlerFilter;

            if (!handlerFilter) {
                return;
            }

            getTitle(handlerFilter);

            const unOnIntentAdded = (io as any).intents.resolver.onIntentAdded((intent: IOConnectBrowser.Intents.IntentInfo) => {
                setMethodsForFilter((methods) => methods.concat([intent]));
            });

            const unOnIntentRemoved = (io as any).intents.resolver.onIntentRemoved((intent: IOConnectBrowser.Intents.IntentInfo) => {
                setMethodsForFilter((methods) =>
                    methods.filter((method: IOConnectBrowser.Intents.IntentInfo) => (method.displayName || method.intent) !== (intent.displayName || intent.intent))
                );
            });
        };

        retrieveMethodsForFilter();
    }, [io]);

    useEffect(() => {
        if ((io as any).intents.resolver.handlerFilter && (!chosenIntentName || methodsForFilter.length)) {
            return;
        }

        const setNewDescription = async () => {
            const { handlersFilter, intent } = (io as any).intents.resolver;

            if (handlersFilter && handlersFilter.intent) {
                setDescription(`"${chosenIntentName || handlersFilter.intent}" action is unassigned. Choose an app to perform this action.`);
                return;
            }

            const callerId = (io as any).intents.resolver?.callerId;

            const instance = io.interop.servers().find((server) => server.instance === callerId);

            const appName = instance?.application || instance?.applicationName;

            const inDesktop = (window as any).iodesktop || (window as any).glue42gd;
            const inBrowser = (window as any).iobrowser || (window as any).glue42core;

            if (inBrowser && instance?.application === "Platform") {
                setDescription(`"${chosenIntentName || intent.displayName || intent.intent}" action from "Platform" is unassigned. Choose an app to perform this action.`);
                setCallerName("Platform")
                return;
            }

            if (!appName || (inDesktop && appName === NO_APP_WINDOW)) {
                setDescription(`"${chosenIntentName || intent.displayName || intent.intent}" action is unassigned. Choose an app to perform this action.`);
                setCallerName(instance?.application || instance?.applicationName || instance?.instance || NO_APP_WINDOW);
                return;
            }

            const app = io.appManager.application(appName);

            if (!app) {
                setDescription(`"${chosenIntentName || intent.displayName || intent.intent}" action is unassigned. Choose an app to perform this action.`);
                setCallerName(instance?.application || instance?.applicationName || instance?.instance || NO_APP_WINDOW);
                return;
            }

            setDescription(`"${chosenIntentName || intent.displayName || intent.intent}" action from "${app.title || app.name}" is unassigned. Choose an app to perform this action.`);
            setCallerName(app.title || app.name);
        };

        setNewDescription();
    }, [chosenIntentName, methodsForFilter]);

    const handleSelectIntentClick = (name: string) => {
        if (!chosenIntentName) {
            setChosenIntentName(name);
            return;
        }

        setChosenIntentName((currentIntentName) => (currentIntentName === name ? "" : name));
    };

    return (
        <Panel>
            <Panel.Header>
                <Title text="Intents Resolver" size="large" />
            </Panel.Header>
            <Panel.Body>
                <Block title={description} />
                {methodsForFilter.length ? (
                    <>
                        <List checkIcon="check" variant="single">
                            {Array.from(new Set(methodsForFilter.map((method) => method.intent))).map((methodName) => (
                                <List.Item key={methodName} onClick={() => handleSelectIntentClick(methodName)} isSelected={methodName === chosenIntentName}>
                                    {methodName}
                                </List.Item>
                            ))}
                        </List>
                        <Button disabled={!chosenIntentName} variant="primary" text="Next" onClick={() => setMethodsForFilter([])} />
                    </>
                ) : (
                    <HandlersPanel intentName={chosenIntentName} callerName={callerName} />
                )}
            </Panel.Body>
        </Panel>
    );
};

export default App;
