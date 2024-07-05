export interface IntentsViewProps {
    chosenIntentName: string;
    handleSelectIntentClick: (name: string) => void;
    setShowIntentList: React.Dispatch<React.SetStateAction<boolean>>;
}