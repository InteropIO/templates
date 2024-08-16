import { Handlers } from "../../shared/types";

export interface HandlersViewProps {
    callerName?: string;
    intentName?: string;
    setShowIntentList: React.Dispatch<React.SetStateAction<boolean>>;
    handlers: Handlers;
}