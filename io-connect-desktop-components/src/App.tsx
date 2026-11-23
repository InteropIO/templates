import { lazy, Suspense } from "react";
import { RouteObject, RouterProvider, createHashRouter } from "react-router-dom";
import NoPage from "./components/NoPage";
import "@interopio/theme";

const Alerts = lazy(() => import("./components/Alerts/Alerts"));
const ChannelSelector = lazy(() => import("./components/ChannelSelector/ChannelSelector"));
const Dialogs = lazy(() => import("./components/Dialogs/Dialogs"));
const DownloadManager = lazy(() => import("./components/DownloadManager/DownloadManager"));
const Feedback = lazy(() => import("./components/Feedback/Feedback"));
const LayoutSharing = lazy(() => import("./components/LayoutSharing/LayoutSharing"));
const NotificationToasts = lazy(() => import("./components/Notifications/Toasts"));
const NotificationPanel = lazy(() => import("./components/Notifications/Panel"));
const PlaceholderApp = lazy(() => import("./components/PlaceholderApp/Page"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <NoPage />,
  },
  {
    path: "alerts",
    element: <Alerts />,
  },
  {
    path: "channel-selector",
    element: <ChannelSelector />,
  },
  {
    path: "dialogs",
    element: <Dialogs />,
  },
  {
    path: "download-manager",
    element: <DownloadManager />,
  },
  {
    path: "feedback",
    element: <Feedback />,
  },
  {
    path: "layout-sharing",
    element: <LayoutSharing />,
  },
  {
    path: "notifications-toasts",
    element: <NotificationToasts />,
  },
  {
    path: "notifications-panel",
    element: <NotificationPanel />,
  },
  {
    path: "placeholder-app",
    element: <PlaceholderApp />,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

const router = createHashRouter(routes, {});

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
