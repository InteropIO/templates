import { IOConnectBrowser } from "@interopio/browser";

export interface IntentsViewProps {
    chosenIntentName: string;
    intentsForFilter: IOConnectBrowser.Intents.IntentInfo[];
    handleSelectIntentClick: (name: string) => void;
    setShowIntentList: React.Dispatch<React.SetStateAction<boolean>>;
}