import { HTMLAttributes } from "react";
import classNames from "classnames";
import Category from "./category";
import useExtendedAreaFavorites from "../../hooks/useExtendedAreaFavorites";

export interface FavoritesCategoryProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

function FavoritesCategory({
  className,
  title = "Favorites",
  ...rest
}: Readonly<FavoritesCategoryProps>) {
  const { items, shouldShow } = useExtendedAreaFavorites();

  if (!shouldShow) {
    return null;
  }

  return (
    <Category
      className={classNames("launchpad-extended-area-category-favorites", className)}
      title={title}
      items={items}
      {...rest}
    />
  );
}

export default FavoritesCategory;
