import React from "react";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import NoPage from "./components/NoPage";
import { DialogsProvider } from "@interopio/components-react";

const ChannelSelector = React.lazy(
  () => import("./components/ChannelSelector")
);
const Dialogs = React.lazy(() => import("./components/Dialogs"));
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
    path: "notifications-toasts",
    element: <NotificationToasts />,
  },
  {
    path: "notifications-panel",
    element: <NotificationPanel />,
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
