import { IOConnectBrowser } from "@interopio/browser";

export interface Handler extends IOConnectBrowser.Intents.ResolverIntentHandler {
    id: string;
}