import React from "react";
import { Icon, List } from "@interopio/components-react";
import { AppIntentHandler, ListProps } from "../../shared/types";

const AppsList = ({ filteredHandlers, chosenIntentHandler, setChosenIntentHandler }: ListProps) => {
    return (
        <List checkIcon="check" variant="single">
            {filteredHandlers.apps.length ? (
                <>
                    <List.ItemSection>All Available Apps</List.ItemSection>
                    {filteredHandlers.apps.map((appHandler: AppIntentHandler) => (
                        <List.Item
                            key={appHandler.id}
                            prepend={<Icon variant="application" />}
                            onClick={() => setChosenIntentHandler(appHandler)}
                            isSelected={!chosenIntentHandler?.instanceId && chosenIntentHandler?.applicationName === appHandler.applicationName}
                        >
                            {appHandler.applicationTitle || appHandler.applicationName}
                        </List.Item>
                    ))}
                </>
            ) : null}
        </List>
    );
};

export default AppsList;