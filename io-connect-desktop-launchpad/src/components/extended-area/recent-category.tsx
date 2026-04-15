import { HTMLAttributes } from "react";
import classNames from "classnames";
import Category from "./category";
import useExtendedAreaRecent from "../../hooks/useExtendedAreaRecent";

export interface RecentCategoryProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

function RecentCategory({ className, title = "Recent", ...rest }: Readonly<RecentCategoryProps>) {
  const { items, shouldShow } = useExtendedAreaRecent();

  if (!shouldShow) {
    return null;
  }

  return (
    <Category
      className={classNames("launchpad-extended-area-category-recent", className)}
      title={title}
      items={items}
      {...rest}
    />
  );
}

export default RecentCategory;
