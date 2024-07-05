import React, { useContext, useEffect, useState } from "react";
import "@interopio/theme";
import { Block, Panel, Title } from "@interopio/components-react";
import { IOConnectContext } from "@interopio/react-hooks";
import { IOConnectBrowser } from "@interopio/browser";
import HandlersView from "./components/HandlersView/HandlersView";
import { NO_APP_WINDOW } from "./shared/constants";
import { useThemeSync } from "./hooks/useTheme";
import IntentsView from "./components/IntentsView/IntentsView";
import { IntentsViewProps } from "./components/IntentsView/types";
import { HandlersViewProps } from "./components/HandlersView/types";

const App = () => {
    const io = useContext(IOConnectContext);
    (window as any).io = io;

    const [description, setDescription] = useState<string>("");
    const [chosenIntentName, setChosenIntentName] = useState<string>("");
    const [showIntentList, setShowIntentList] = useState<boolean>(!!io.intents.resolver?.handlerFilter);
    const [callerName, setCallerName] = useState<string>("");

    useThemeSync();

    useEffect(() => {
        const setTitleForHandlersFilter = ({ intent, title, applicationNames, contextTypes, resultType }: IOConnectBrowser.Intents.HandlerFilter) => {
            if (intent) {
                setDescription(`"${chosenIntentName || intent}" action is unassigned. Choose an app to perform this action.`);
                return;
            }

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

        const setTitle = () => {
            const { handlerFilter, intent } = io.intents.resolver!;

            const callerId = (io as any).intents.resolver?.callerId;

            const instance = io.interop.servers().find((server) => server.instance === callerId);

            const appName = instance?.application || instance?.applicationName;

            const inDesktop = (window as any).iodesktop || (window as any).glue42gd;
            const inBrowser = (window as any).iobrowser || (window as any).glue42core;

            const intentName = chosenIntentName || typeof intent === "string" ? intent : intent?.intent || "";

            const caller = instance?.application || instance?.applicationName || instance?.instance || NO_APP_WINDOW;

            setCallerName(caller);

            if (handlerFilter) {
                setTitleForHandlersFilter(handlerFilter);
                return;
            }

            if (inBrowser && instance?.application === "Platform") {
                setDescription(`"${intentName}" action from "Platform" is unassigned. Choose an app to perform this action.`);
                return;
            }

            if (!appName || !io.appManager.application(appName) || (inDesktop && appName === NO_APP_WINDOW)) {
                setDescription(`"${intentName}" action is unassigned. Choose an app to perform this action.`);
                return;
            }

            const app = io.appManager.application(appName)!;

            setDescription(`"${intentName}" action from "${app.title || app.name}" is unassigned. Choose an app to perform this action.`);

            setCallerName(app.title || app.name);
        };

        setTitle();
    }, [io, chosenIntentName]);

    const handleSelectIntentClick = (name: string) => {
        if (!chosenIntentName) {
            setChosenIntentName(name);
            return;
        }

        setChosenIntentName((currentIntentName) => (currentIntentName === name ? "" : name));
    };

    const getIntentsViewProps = (): IntentsViewProps => {
        return { chosenIntentName, handleSelectIntentClick, setShowIntentList };
    };

    const getHandlersViewProps = (): HandlersViewProps => {
        return { intentName: chosenIntentName, callerName, setShowIntentList };
    }

    return (
        <Panel>
            <Panel.Header>
                <Title text="Intents Resolver" size="large" />
            </Panel.Header>
            <Panel.Body>
                <Block title={description} />
                {showIntentList ? (
                    <IntentsView {...getIntentsViewProps()} />
                ) : (
                    <HandlersView {...getHandlersViewProps()} />
                )}
            </Panel.Body>
        </Panel>
    );
};

export default App;
