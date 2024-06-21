import { IOConnectContext } from "@interopio/react-hooks";
import { useContext, useEffect } from "react";

export const useThemeSync = (): void => {
    const io = useContext(IOConnectContext);
  
    useEffect(() => {
      let isUnsubscribed = false;
      const themesApi = io?.themes;
  
      if (!themesApi) {
        return;
      }
  
      const changeTheme = async (theme: any) => {
        if (isUnsubscribed) {
          return;
        }
  
        const htmlElement = document.documentElement;
  
        if (htmlElement.classList.contains(theme.name)) {
          return;
        }
  
        const allThemes = await themesApi.list();
  
        htmlElement.classList.remove(...allThemes.map(({ name }) => name));
  
        htmlElement.classList.add(theme.name);
      };
  
      themesApi.onChanged(changeTheme);
  
      themesApi.getCurrent().then(changeTheme);
  
      return () => {
        isUnsubscribed = true;
      };
    }, []);
  };