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
    setChosenIntentHandler: React.Dispatch<React.SetStateAction<IOConnectBrowser.Intents.ResolverIntentHandler | undefined>>;
}