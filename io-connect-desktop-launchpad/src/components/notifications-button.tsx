import { HTMLAttributes, memo } from "react";
import classNames from "classnames";
import { Badge, ButtonIcon } from "@interopio/components-react";
import { useNotificationCounterAndBadge } from "../hooks/useNotificationCounterAndBadge";

function NotificationsButton({ className, ...rest }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  const { notificationsCount, showNotificationBadge, toggleNotificationPanel } =
    useNotificationCounterAndBadge();
  const shouldShowBadge = showNotificationBadge && notificationsCount > 0;
  const badgeText = notificationsCount > 99 ? "99+" : notificationsCount;

  return (
    <div className={classNames("notifications-button", "non-draggable", className)} {...rest}>
      {shouldShowBadge && <Badge variant="primary">{badgeText}</Badge>}
      <ButtonIcon
        variant="circle"
        icon="bell"
        size="32"
        title="Notifications"
        onClick={toggleNotificationPanel}
      />
    </div>
  );
}

export default memo(NotificationsButton);
