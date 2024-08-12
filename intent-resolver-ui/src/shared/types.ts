import { IOConnectBrowser } from "@interopio/browser";

export interface AppIntentHandler extends Omit<IOConnectBrowser.Intents.ResolverIntentHandler, "instanceId"> {
    id: string;
}

export interface InstanceIntentHandler extends IOConnectBrowser.Intents.ResolverIntentHandler {
    id: string;
    instanceId: string;
}

export interface InstanceIntentHandlers {
    [appName: string]: InstanceIntentHandler[];
}

export interface Handlers {
    apps: ({ intent: IOConnectBrowser.Intents.IntentInfo, handler: AppIntentHandler })[];
    instances: ({ intent: IOConnectBrowser.Intents.IntentInfo, handler: InstanceIntentHandler })[];
}

export interface ListProps {
    intentName?: string;
    filteredHandlers: Handlers;
    chosenIntentHandler: IOConnectBrowser.Intents.ResolverIntentHandler | undefined;
    handleSelectHandlerClick: (handler: InstanceIntentHandler | AppIntentHandler) => void;
}

export interface UnsubscribeFunction {
    (): void;
}

export interface IntentInfo extends IOConnectBrowser.Intents.IntentInfo {
    name: string;
    contexts?: string[];
}