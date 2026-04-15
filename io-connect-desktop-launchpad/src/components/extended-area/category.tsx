import React, { HTMLAttributes, useContext, useMemo, useCallback } from "react";
import classNames from "classnames";
import { Title, List } from "@interopio/components-react";
import { IOConnectContext } from "@interopio/react-hooks";
import CategoryItem from "./category-item";
import { useApplications } from "../../hooks/useApplications";
import { useApplicationsInstances } from "../../hooks/useApplicationsInstances";
import { useStartApplication } from "../../hooks/useStartApplication";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useRestoreWorkspace } from "../../hooks/useRestoreWorkspace";
import { useRunningWorkspaces } from "../../hooks/useRunningWorkspaces";
import { requestAlert } from "../../utils/alerts";
import { CATEGORY_ITEM_TYPES } from "../../constants/constants";
import { ItemActionConfig } from "../../types";

export interface CategoryProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  items?: Array<{ type: string; name: string }>;
  onItemClick?: (action: ItemActionConfig) => void;
}

function Category({ className, title, items, onItemClick }: Readonly<CategoryProps>) {
  const io = useContext(IOConnectContext);
  const applications = useApplications();
  const workspaces = useWorkspaces();
  const applicationsInstances = useApplicationsInstances();
  const startApplication = useStartApplication();
  const restoreWorkspace = useRestoreWorkspace();
  const runningWorkspaces = useRunningWorkspaces();

  const applicationsByName = useMemo(
    () => Object.fromEntries(applications.map((application) => [application.name, application])),
    [applications]
  );

  const workspacesByTitle = useMemo(
    () => Object.fromEntries(workspaces.map((workspace) => [workspace.title, workspace])),
    [workspaces]
  );

  const openAppIds = useMemo(
    () =>
      new Set(
        Object.keys(applicationsInstances).filter(
          (id) => (applicationsInstances[id] ?? []).length > 0
        )
      ),
    [applicationsInstances]
  );

  const runningWorkspaceTitles = useMemo(
    () => new Set(runningWorkspaces.map((ws) => ws.title)),
    [runningWorkspaces]
  );

  // Filter out items that don't have valid applications/workspaces
  const validItems = useMemo(() => {
    if (!items) {
      return [];
    }

    return items.filter((item) => {
      if (item.type === CATEGORY_ITEM_TYPES.APPLICATION) {
        return Boolean(applicationsByName[item.name]);
      }

      if (item.type === CATEGORY_ITEM_TYPES.WORKSPACE) {
        return Boolean(workspacesByTitle[item.name]);
      }

      return false;
    });
  }, [items, applicationsByName, workspacesByTitle]);

  const handlePerformAction = useCallback(
    async ({ type, id, title }: { type: string; id: string; title: string }) => {
      const modifier: string | null = null;

      try {
        if (type === CATEGORY_ITEM_TYPES.APPLICATION) {
          await startApplication({ id, title, modifier });
        } else if (type === CATEGORY_ITEM_TYPES.WORKSPACE) {
          await restoreWorkspace({ id, modifier });
        }
      } catch (error) {
        await requestAlert({
          io,
          variant: "warning",
          text:
            type === CATEGORY_ITEM_TYPES.APPLICATION
              ? `Failed to start app "${title}".`
              : `Failed to restore workspace "${title}".`,
          error,
        });
      }
    },
    [io, startApplication, restoreWorkspace]
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className={classNames("launchpad-extended-area-category", className)}>
      <Title text={title} size="small" />
      <List className="launchpad-extended-area-category-items">
        {validItems.map((item) => {
          if (item.type === CATEGORY_ITEM_TYPES.APPLICATION) {
            const application = applicationsByName[item.name];

            if (!application) {
              return null;
            }

            const id = application.name;
            const itemTitle = application.title ?? application.name;
            const hasOpenInstance = openAppIds.has(id);

            return (
              <CategoryItem
                key={`${item.type}-${item.name}`}
                id={id}
                title={itemTitle}
                type={CATEGORY_ITEM_TYPES.APPLICATION}
                icon="application"
                iconSrc={application.icon}
                hasOpenInstance={hasOpenInstance}
                onItemClick={onItemClick}
                onPerformAction={handlePerformAction}
              />
            );
          }

          if (item.type === CATEGORY_ITEM_TYPES.WORKSPACE) {
            const workspace = workspacesByTitle[item.name];

            if (!workspace) {
              return null;
            }

            const id = workspace.title;
            const itemTitle = workspace.title;
            const hasOpenInstance = runningWorkspaceTitles.has(itemTitle);

            return (
              <CategoryItem
                key={`${item.type}-${item.name}`}
                id={id}
                title={itemTitle}
                type={CATEGORY_ITEM_TYPES.WORKSPACE}
                icon="workspace"
                hasOpenInstance={hasOpenInstance}
                onItemClick={onItemClick}
                onPerformAction={handlePerformAction}
              />
            );
          }

          return null;
        })}
      </List>
    </div>
  );
}

export default Category;
