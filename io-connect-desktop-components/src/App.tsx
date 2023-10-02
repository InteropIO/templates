import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import NoPage from "./components/NoPage";
import { DialogsProvider } from "@interopio/components-react";

const ChannelsSelector = React.lazy(
  () => import("./components/ChannelSelector")
);
const Dialogs = React.lazy(() => import("./components/Dialogs"));
const NotificationsToasts = React.lazy(
  () => import("./components/Notifications/Toasts")
);
const NotificationsPanel = React.lazy(
  () => import("./components/Notifications/Panel")
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <NoPage />,
  },
  {
    path: "channel-selector",
    element: <ChannelsSelector />,
  },
  {
    path: "notifications-toasts",
    element: <NotificationsToasts />,
  },
  {
    path: "notifications-panel",
    element: <NotificationsPanel />,
  },
  {
    path: "dialogs",
    element: (
      <DialogsProvider>
        <Dialogs />
      </DialogsProvider>
    ),
  },
];

const router = createHashRouter(routes, {});

function App() {
  return (
    <React.Suspense fallback={<>...</>}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}

export default App;
