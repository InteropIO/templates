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
    apps: AppIntentHandler[];
    instances: InstanceIntentHandler[];
}

export interface ListProps {
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