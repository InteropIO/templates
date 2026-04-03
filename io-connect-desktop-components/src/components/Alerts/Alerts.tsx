import { IOAlerts } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/alerts/styles.css";
import "./Alerts.css";

const { AlertsProvider, Alert } = IOAlerts;

function AlertsWrapper() {
  return (
    <AlertsProvider>
      <Alerts />
    </AlertsProvider>
  );
}

function Alerts() {
  return <Alert />;
}

export default AlertsWrapper;
