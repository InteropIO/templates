import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LaunchpadBodyPopupContextValue {
  showPopup: boolean;
  togglePopup: () => void;
  openPopup: () => void;
  closePopup: () => void;
}

const LaunchpadBodyPopupContext = createContext<LaunchpadBodyPopupContextValue | null>(null);

export function LaunchpadBodyPopupProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = useCallback(() => {
    setShowPopup((prev) => !prev);
  }, []);

  const openPopup = useCallback(() => {
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <LaunchpadBodyPopupContext.Provider value={{ showPopup, togglePopup, openPopup, closePopup }}>
      {children}
    </LaunchpadBodyPopupContext.Provider>
  );
}

export function useLaunchpadBodyPopupContext() {
  const context = useContext(LaunchpadBodyPopupContext);

  if (!context) {
    throw new Error("useLaunchpadBodyPopupContext must be used within LaunchpadBodyPopupProvider");
  }

  return context;
}
