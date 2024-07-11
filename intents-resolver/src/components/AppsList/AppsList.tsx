import React from "react";
import { Icon, List, ImageIcon } from "@interopio/components-react";
import { ListProps } from "../../shared/types";

const AppsList = ({ filteredHandlers, chosenIntentHandler, handleSelectHandlerClick }: ListProps) => {
    return (
        <List checkIcon="check" variant="single">
            {filteredHandlers.apps.length ? (
                <>
                    <List.ItemSection>All Available Apps</List.ItemSection>
                    {filteredHandlers.apps.map(({ handler, intent }) => (
                        <List.Item
                            key={handler.id}
                            prepend={handler.applicationIcon ? <ImageIcon src={handler.applicationIcon} alt="" /> : <Icon variant="application" />}
                            onClick={() => handleSelectHandlerClick(handler)}
                            isSelected={!chosenIntentHandler?.instanceId && chosenIntentHandler?.applicationName === handler.applicationName}
                        >
                            {handler.applicationTitle || handler.applicationName}
                        </List.Item>
                    ))}
                </>
            ) : null}
        </List>
    );
};

export default AppsList;