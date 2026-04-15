import { LaunchpadBody } from "@interopio/home-ui-react";
import ExternalPopup, { ExternalPopupProps } from "./external-popup";

function LaunchpadBodyPopup({
  popupTrigger,
  popupConfig,
  hidePopup,
}: Readonly<ExternalPopupProps>) {
  const popupProps = {
    popupTrigger,
    popupConfig,
    hidePopup,
  };

  return (
    <ExternalPopup {...popupProps}>
      <LaunchpadBody />
    </ExternalPopup>
  );
}

export default LaunchpadBodyPopup;
