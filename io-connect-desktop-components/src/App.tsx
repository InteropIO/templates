import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import NoPage from "./components/NoPage";
import "@interopio/theme";

const ChannelSelector = React.lazy(
  () => import("./components/ChannelSelector/ChannelSelector")
);
const Dialogs = React.lazy(() => import("./components/Dialogs/Dialogs"));
const IssueReporting = React.lazy(
  () => import("./components/IssueReporting/IssueReporting")
);
const NotificationToasts = React.lazy(
  () => import("./components/Notifications/Toasts")
);
const NotificationPanel = React.lazy(
  () => import("./components/Notifications/Panel")
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <NoPage />,
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
    path: "issue-reporting",
    element: <IssueReporting />,
  },
  {
    path: "notifications-toasts",
    element: <NotificationToasts />,
  },
  {
    path: "notifications-panel",
    element: <NotificationPanel />,
  },
];

const router = createBrowserRouter(routes, {});

function App() {
  return (
    <React.Suspense fallback={<>...</>}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default App;
