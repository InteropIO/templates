import { HTMLAttributes } from "react";
import classNames from "classnames";
import { usePlatformPref } from "@interopio/home-ui-react";
import FavoritesCategory from "./favorites-category";
import RecentCategory from "./recent-category";
import CustomCategories from "./custom-categories";
import { PLATFORM_PREFS_KEYS } from "../../constants/constants";

function ExtendedArea({ className, ...rest }: Readonly<HTMLAttributes<HTMLDivElement>>) {
  const { value: shouldHideLabels = true } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.LAUNCHPAD_HIDE_LABELS_IN_EXTENDED_AREA,
  });

  const classes = classNames("launchpad-extended-area", "non-draggable", className, {
    "launchpad-extended-area-hide-labels": shouldHideLabels,
  });

  return (
    <div className={classes} {...rest}>
      <FavoritesCategory />
      <RecentCategory />
      <CustomCategories />
    </div>
  );
}

export default ExtendedArea;
