import { IOConnectDesktop } from "@interopio/desktop";
import { IconProps } from "@interopio/components-react";

export type MenuItem = MenuItemConfig | MenuSeparator;
export type MenuItemComponent = () => MenuItemConfig;
export type SupportedCategoryItemType = "application" | "workspace";
export type StartApplicationConfig = {
  kind: "application";
  id: string;
  modifier: string | null;
  title?: string;
};
export type RestoreWorkspaceConfig = { kind: "workspace"; id: string; modifier: string | null };
export type ItemActionConfig = StartApplicationConfig | RestoreWorkspaceConfig;

export interface PopupConfig {
  size?: { width: number; height: number };
  targetBounds?: IOConnectDesktop.Windows.IOConnectWindow["bounds"];
  targetLocation?: IOConnectDesktop.Windows.PopupOptions["targetLocation"];
  focus?: boolean;
  horizontalOffset?: number;
  verticalOffset?: number;
}

export interface MenuItemProps {
  disabled?: boolean;
}

export interface MenuItemConfig {
  label: string;
  icon: IconProps["variant"];
  onClick: () => void;
  disabled?: boolean;
}

export interface MenuSeparator {
  separator: true;
}

export interface CategoryItemProps {
  id: string;
  title: string;
  type: string;
  description?: string;
  icon?: IconProps["variant"];
  iconSrc?: string;
  tooltip?: string;
  className?: string;
}

export function isSupportedCategoryItemType(type: string): type is SupportedCategoryItemType {
  return type === "application" || type === "workspace";
}

export interface UserPropertiesCategory {
  name: string;
  items: Array<{
    name: string;
    type: string;
  }>;
}

export interface CustomCategory {
  name: string;
  items: CategoryItemProps[];
}

export interface RecentItem {
  name: string;
  type: string;
}

export interface CompositionChangedEventBase {
  windowName: string;
  data?: {
    windowState?: string | null;
  };
}

export interface CreatedEventBase {
  data?: {
    applicationName?: string;
    mode?: string;
    hidden?: boolean;
  };
}
