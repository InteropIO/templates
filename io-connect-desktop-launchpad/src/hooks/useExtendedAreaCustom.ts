import { useContext, useEffect, useMemo, useState } from "react";
import { IOConnectDesktop } from "@interopio/desktop";
import { IOConnectContext } from "@interopio/react-hooks";
import { usePlatformPref } from "@interopio/home-ui-react";
import { PLATFORM_PREFS_KEYS } from "../constants/constants";
import { UserPropertiesCategory } from "../types";

export interface UseExtendedAreaCustomResult {
  categoryOrder: string;
  categoryItemOrder: string;
  categories: Array<{ name: string; items: Array<{ type: string; name: string }> }>;
}

export function useExtendedAreaCustom(): UseExtendedAreaCustomResult {
  const io = useContext(IOConnectContext) as unknown as IOConnectDesktop.API;
  const { value: isLaunchpadDocked = false } = usePlatformPref({
    prefKey: PLATFORM_PREFS_KEYS.IS_LAUNCHPAD_DOCKED,
  });
  const [config, setConfig] = useState<UseExtendedAreaCustomResult>({
    categoryOrder: "default",
    categoryItemOrder: "default",
    categories: [],
  });

  // Extended area is only visible when docked - skip processing if not docked
  if (!isLaunchpadDocked) {
    return {
      categoryOrder: "default",
      categoryItemOrder: "default",
      categories: [],
    };
  }

  useEffect(() => {
    if (!io) {
      return;
    }

    const userProperties = io.windows.my()?.application?.userProperties;

    if (userProperties) {
      const categoryOrder = userProperties.extendedAreaCategoryOrder ?? "default";
      const categoryItemOrder = userProperties.extendedAreaCategoryItemOrder ?? "default";
      const categories: UserPropertiesCategory[] = userProperties.extendedAreaCategories ?? [];

      // Return minimal item references - CategoryItem will transform them
      setConfig({
        categoryOrder,
        categoryItemOrder,
        categories: categories.map((category) => ({
          name: category.name,
          items: category.items,
        })),
      });
    }
  }, [io]);

  return useMemo(
    () => ({
      categoryOrder: config.categoryOrder,
      categoryItemOrder: config.categoryItemOrder,
      categories: config.categories,
    }),
    [config.categoryOrder, config.categoryItemOrder, config.categories]
  );
}
