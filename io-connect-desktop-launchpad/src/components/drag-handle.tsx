import { HTMLAttributes } from "react";
import classNames from "classnames";

function DragHandle({ className, ...rest }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={classNames("launchpad-drag-handle", className)} {...rest}>
      <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="0" y="3" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="0" y="6" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="0" y="9" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
        <rect x="0" y="12" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

export default DragHandle;
