import { HTMLAttributes } from "react";
import classNames from "classnames";
import Category from "./category";
import { useExtendedAreaCustom } from "../../hooks/useExtendedAreaCustom";

function CustomCategory({ className }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  const { categories } = useExtendedAreaCustom();

  return categories.map(({ name: title, items }) => (
    <Category
      key={title}
      className={classNames("launchpad-extended-area-category-custom", className)}
      title={title}
      items={items}
    />
  ));
}

export default CustomCategory;
