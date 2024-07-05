import React, { useContext } from "react";
import { Dropdown, Icon, List } from "@interopio/components-react";
import { InstanceIntentHandler, ListProps } from "../../shared/types";
import { IOConnectContext } from "@interopio/react-hooks";

const InstancesList = ({ filteredHandlers, chosenIntentHandler, handleSelectHandlerClick }: ListProps) => {
    const io = useContext(IOConnectContext);

    const handleListItemClick = (instances: InstanceIntentHandler[]) => {
        if (instances.length > 1) {
            return;
        }

        handleSelectHandlerClick(instances[0]);
    };

    const groupInstances = (handlers: InstanceIntentHandler[]): { [app: string]: InstanceIntentHandler[] } => {
        let groupedInstances: { [appName: string]: InstanceIntentHandler[] } = {};

        handlers.forEach((handler) => {
            const app = handler.applicationTitle || handler.applicationName;

            if (groupedInstances[app]?.length) {
                groupedInstances[app].push(handler);
                return;
            }

            groupedInstances[app] = [handler];
        });

        return groupedInstances;
    };

    // TODO: handle focus in io.CB and io.CD
    const handleHover = async (handler: InstanceIntentHandler) => {
        const win = io.windows.findById(handler.instanceId);

        if (!win) {
            return;
        }

        await win.focus();
    };

    return (
        <List checkIcon="check" variant="single">
            {filteredHandlers.instances.length ? (
                <>
                    <List.ItemSection>Open apps</List.ItemSection>
                    {Object.entries(groupInstances(filteredHandlers.instances)).map(([app, instances]) => (
                        <List.Item
                            key={app}
                            prepend={<Icon variant="application" />}
                            onClick={() => handleListItemClick(instances)}
                            isSelected={instances.length === 1 && chosenIntentHandler?.instanceId === instances[0].instanceId}
                            append={
                                instances.length > 1 ? (
                                    <Dropdown variant="outline">
                                        <Dropdown.Button icon="chevron-down">App Instances</Dropdown.Button>
                                        <Dropdown.Content>
                                            <List checkIcon="check" variant="single">
                                                {instances.map((handler) => (
                                                    <List.Item
                                                        key={handler.instanceId}
                                                        onClick={() => handleSelectHandlerClick(handler)}
                                                        isSelected={chosenIntentHandler?.instanceId === handler.instanceId}
                                                        // onMouseEnter={() => handleHover(handler)}
                                                    >
                                                        {handler.applicationTitle || handler.applicationName || handler.instanceId}({handler.instanceId})
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </Dropdown.Content>
                                    </Dropdown>
                                ) : null
                            }
                        >
                            {app}
                        </List.Item>
                    ))}
                </>
            ) : null}
        </List>
    );
};

export default InstancesList;