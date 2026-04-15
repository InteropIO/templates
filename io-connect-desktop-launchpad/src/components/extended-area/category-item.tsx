import { memo, useCallback } from "react";
import classNames from "classnames";
import { Icon, ImageIcon, List, IOA11y } from "@interopio/components-react";
import { CATEGORY_ITEM_TYPES } from "../../constants/constants";
import { ItemActionConfig } from "../../types";

interface CategoryItemComponentProps {
  id: string;
  title: string;
  type: string;
  icon: "application" | "workspace";
  iconSrc?: string;
  hasOpenInstance: boolean;
  onItemClick?: (action: ItemActionConfig) => void;
  onPerformAction: (config: { type: string; id: string; title: string }) => Promise<void>;
}

const { isClickKeypress } = IOA11y;

function CategoryItem({
  id,
  title,
  type,
  icon,
  iconSrc,
  hasOpenInstance,
  onItemClick,
  onPerformAction,
}: Readonly<CategoryItemComponentProps>) {
  const handleClick = useCallback(async () => {
    const modifier: string | null = null;
    const action: ItemActionConfig =
      type === CATEGORY_ITEM_TYPES.APPLICATION
        ? { kind: CATEGORY_ITEM_TYPES.APPLICATION, id, modifier, title }
        : { kind: CATEGORY_ITEM_TYPES.WORKSPACE, id, modifier };

    await onPerformAction({ type, id, title });
    onItemClick?.(action);
  }, [id, title, type, onItemClick, onPerformAction]);

  const tooltip = title;

  const prepend = iconSrc ? (
    <ImageIcon size="16" src={iconSrc} alt={`${title} icon`} />
  ) : (
    <Icon size="16" variant={icon} />
  );

  return (
    <List.Item
      className={classNames({
        "io-list-item-active": hasOpenInstance,
      })}
      prepend={prepend}
      tooltip={tooltip ?? title}
      title={title}
      onClick={handleClick}
      tabIndex={0}
      aria-label={title}
      onKeyDown={(event) => {
        if (isClickKeypress(event)) {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <span className="launchpad-category-item-title">{title}</span>
    </List.Item>
  );
}

export default memo(CategoryItem);
