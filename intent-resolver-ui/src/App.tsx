import React, { useContext, useEffect, useState } from "react";
import "@interopio/theme";
import { Panel, Title } from "@interopio/components-react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import HandlersView from "./components/HandlersView/HandlersView";
import { useThemeSync } from "./hooks/useTheme";
import IntentsView from "./components/IntentsView/IntentsView";
import { IntentsViewProps } from "./components/IntentsView/types";
import { HandlersViewProps } from "./components/HandlersView/types";
import { Handlers, InstanceIntentHandler } from "./shared/types";
import { BrowserClientControlMethodName, DesktopClientControlMethodName } from "./shared/constants";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [description, setDescription] = useState<string>("");
    const [chosenIntentName, setChosenIntentName] = useState<string>("");
    const [showIntentList, setShowIntentList] = useState<boolean>(!!(io.intents.resolver as any)?.handlerFilter);
    const [callerName, setCallerName] = useState<string>("");

    const [handlers, setHandlers] = useState<Handlers>({ apps: [], instances: [] });
    const [intentsForFilter, setIntentsForFilter] = useState<IOConnectBrowser.Intents.IntentInfo[]>([]);
    
    useThemeSync();

    useEffect(() => {
        const setTitleForHandlersFilter = ({ intent, title, applicationNames, contextTypes, resultType }: IOConnectBrowser.Intents.HandlerFilter, callerName?: string) => {
            if (intent) {
                setDescription(`"${chosenIntentName || intent}" action ${callerName ? `from "${callerName}" ` : ""}is unassigned. Choose an app to perform this action.`);
                return;
            }

            if (title) {
                setDescription(title);
                return;
            }

            const contextTypesString = contextTypes?.length ? `'${contextTypes.join(", ")}' contexts` : "";
            const applicationNamesString = applicationNames?.length ? `${applicationNames.join(", ")} apps` : "";

            const description = `Choose action for ${contextTypesString}${contextTypesString && (resultType || applicationNames) ? "and" : ""}${resultType ? `'${resultType}' result type` : ""}${
                resultType && applicationNamesString ? "and" : ""
            }${applicationNamesString ? `'${applicationNamesString}' applications` : ""}`;

            setDescription(description);
        };

        const setTitle = () => {
            const { handlerFilter, intent } = io.intents.resolver! as any;

            const caller = (io as any).intents.resolver?.caller;

            const callerNameToShow: string = caller ? caller.applicationTitle || caller.applicationName || caller.id : "";

            const intentName = chosenIntentName || typeof intent === "string" ? intent : intent?.intent || "";

            setCallerName(callerNameToShow);

            if (handlerFilter) {
                setTitleForHandlersFilter(handlerFilter, callerNameToShow);
                
                return;
            }

            setDescription(`"${intentName}" action ${callerNameToShow ? `from "${callerNameToShow}" ` : ""}is unassigned. Choose an app to perform this action.`);
        };

        setTitle();
    }, [io, chosenIntentName]);

    useEffect(() => {
        let unsubOnHandlerAdded: () => void;
        let unsubOnHandlerRemoved: () => void;

        const subscribeOnHandlerAdded = () => {
            unsubOnHandlerAdded = (io as any).intents.resolver?.onHandlerAdded(
                (handler: IOConnectBrowser.Intents.ResolverIntentHandler, intent?: IOConnectBrowser.Intents.IntentInfo): void => {                                      
                    if (showIntentList && intent) {
                        setIntentsForFilter((methods) => methods.concat([intent]));
                    }

                    if (chosenIntentName && chosenIntentName !== intent?.intent) {
                        return;
                    }

                    const isInstance = handler.instanceId;
                    const isFirstOpenInstance = handlers.instances.find((intentHandler) => intentHandler.handler.applicationName === handler.applicationName);

                    if (isInstance && isFirstOpenInstance) {
                        setHandlers((handlers) => ({
                            apps: handlers.apps,
                            instances: [
                                ...handlers.instances,
                                { handler: { ...handler, id: handler.instanceId }, intent } as { handler: InstanceIntentHandler; intent: IOConnectBrowser.Intents.IntentInfo; }
                            ],
                        }));

                        return;
                    }

                    const handlerWithId = { ...handler, id: isInstance ? handler.instanceId : handler.applicationName };

                    const updateValue = handler.instanceId ? "instances" : "apps";

                    setHandlers((handlers) => ({ ...handlers, [updateValue]: [...handlers[updateValue], { handler: handlerWithId, intent }] }));
                }
            );
        };

        const subscribeOnHandlerRemoved = () => {
            unsubOnHandlerRemoved = (io as any).intents.resolver?.onHandlerRemoved(
                (removedHandler: IOConnectBrowser.Intents.ResolverIntentHandler, intent?: IOConnectBrowser.Intents.IntentInfo) => {
                    if (showIntentList && intent) {
                        setIntentsForFilter((methods) =>
                            methods.filter((method: IOConnectBrowser.Intents.IntentInfo) => (method.displayName || method.intent) !== (intent.displayName || intent.intent))
                        );
                    }

                    if (chosenIntentName && chosenIntentName !== intent?.intent) {
                        return;
                    }

                    const updateValue = removedHandler.instanceId ? "instances" : "apps";

                    setHandlers((handlers) => ({
                        ...handlers,
                        [updateValue]: handlers[updateValue].filter(({ handler }) =>
                            removedHandler.instanceId ? handler.id !== removedHandler.instanceId : handler.applicationName !== removedHandler.applicationName
                        ),
                    }));
                }
            );
        };

        subscribeOnHandlerAdded();
        subscribeOnHandlerRemoved();

        return () => {
            unsubOnHandlerAdded();
            unsubOnHandlerRemoved();
        };
    }, [io]);

    useEffect(() => {
        const checkSetShowIntentList = async () => {
            // only use it if 'handlerFilter' is defined 
            if (typeof (io.intents.resolver as any).handlerFilter !== "object") {
                setShowIntentList(false);

                return;
            }

            if ((io.intents.resolver as any).handlerFilter.intent) {               
                setShowIntentList(false);
                setChosenIntentName((io.intents.resolver as any).filterHandler.intent);

                return;
            }

            const globalBrowserNamespace = (window as any).glue42core || (window as any).iobrowser;

            const methodName = globalBrowserNamespace ? BrowserClientControlMethodName : DesktopClientControlMethodName;

            const data = globalBrowserNamespace ? { domain: "system", operation: "isFdc3DataWrappingSupported" } : { command: "isFdc3DataWrappingSupported" };

            try {
                const res = await io.interop.invoke<{ isSupported: boolean }>(methodName, data, { instance: io.interop.instance.instance });
    
                const { isSupported } = res.returned;

                setShowIntentList(isSupported);
            } catch (error) {
                setShowIntentList(false);
            }
        };

        checkSetShowIntentList();
    }, [io]);

    const handleSelectIntentClick = (name: string) => {
        if (!chosenIntentName) {
            setChosenIntentName(name);
            return;
        }

        setChosenIntentName((currentIntentName) => (currentIntentName === name ? "" : name));
    };

    const getIntentsViewProps = (): IntentsViewProps => {
        return { chosenIntentName, handleSelectIntentClick, setShowIntentList, intentsForFilter };
    };

    const getHandlersViewProps = (): HandlersViewProps => {
        return { intentName: chosenIntentName, callerName, setShowIntentList, handlers };
    };

    return (
        <Panel>
            <Panel.Header>
                <Title text="Intents Resolver" size="large" />
            </Panel.Header>
            <Panel.Body>
                <p className="io-text-default-lh16">{description}</p>
                {showIntentList ? <IntentsView {...getIntentsViewProps()} /> : <HandlersView {...getHandlersViewProps()} />}
            </Panel.Body>
        </Panel>
    );
};

export default App;
