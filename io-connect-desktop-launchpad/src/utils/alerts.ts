import { IOConnectDesktop } from "@interopio/desktop";
import { HOME_ALERT_TTL, HOME_ALERT_VARIANTS } from "../constants/constants";
import extractErrorMessage from "./extractErrorMsg";

type HomeAlertVariant = (typeof HOME_ALERT_VARIANTS)[keyof typeof HOME_ALERT_VARIANTS];

export const requestAlert = async (config: {
  io: IOConnectDesktop.API;
  variant: HomeAlertVariant;
  text: string;
  error?: any;
}): Promise<void> => {
  const { io, variant, text, error: ioError } = config;
  const ioErrorMessage = extractErrorMessage(ioError);

  try {
    if (variant === HOME_ALERT_VARIANTS.WARNING) {
      io.logger.warn(ioErrorMessage ? `${text} ${ioErrorMessage}` : text);
    }

    const alertConfig = {
      text,
      variant,
      ttl: HOME_ALERT_TTL[variant],
    };

    await (globalThis as any).glue42alerts.request(alertConfig);
  } catch (error) {
    io.logger.warn(`Failed to request alert. ${extractErrorMessage(error)}`);
  }
};
