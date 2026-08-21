# Launchpad App for io.Connect Desktop

Template for creating a custom desktop Launchpad app for **io.Connect Desktop**, built on top of the
`IOLaunchpadDesktop` feature exported by [`@interopio/components-react`](../../packages/components-react). Clone
this app and customize only the pieces you need — everything else keeps working out of the box.

## Prerequisites

**io.Connect Desktop** is required, since this app only configures the `desktop` factory (see
[src/constants/constants.ts](src/constants/constants.ts)).

## Setup

- Run `npm install` to install all dependencies.
- Run `npm run start` to start the app (dev server runs on `http://localhost:4242` by default, see
  [vite.config.ts](vite.config.ts)).
- Point your io.Connect Desktop configuration's Launchpad/System application entry to this app's URL, then start
  io.Connect Desktop to see your customized Launchpad. Refer to your io.Connect Desktop version's documentation for
  the exact application-definition file and property to update.
- Run `npm run build` to produce a production build in `dist/`.
- Start **io.Connect Desktop** to start using and modifying your Launchpad App.

## How it's wired

`src/components/launchpad.tsx` wires up the required providers around a single `<Launchpad />` component. You
don't need to pass a `components` prop at all - `<Launchpad />` already renders a fully working default header
(`DragHandle` + `LogoButton` before search, `ExtendedArea` + `NotificationsButton` + `MainContextMenu` after
search) out of the box:

```tsx
import {
  ThemeProvider,
  PlatformPrefsProvider,
  IOActivePanelRenderer,
  IODownloadManager,
  IOLaunchpadDesktop,
  IONotifications,
} from "@interopio/components-react";

const { LaunchpadProvider, LaunchpadBodyPopupProvider, PanelPopupProvider, Launchpad } = IOLaunchpadDesktop;
const { NotificationsProvider } = IONotifications;
const { DownloadManagerProvider } = IODownloadManager;
const { PanelManagerProvider } = IOActivePanelRenderer;

function LaunchpadWrapper() {
  return (
    <ThemeProvider>
      <PlatformPrefsProvider>
        <NotificationsProvider>
          <DownloadManagerProvider>
            <PanelManagerProvider>
              <LaunchpadProvider>
                <LaunchpadBodyPopupProvider>
                  <PanelPopupProvider>
                    <Launchpad />
                  </PanelPopupProvider>
                </LaunchpadBodyPopupProvider>
              </LaunchpadProvider>
            </PanelManagerProvider>
          </DownloadManagerProvider>
        </NotificationsProvider>
      </PlatformPrefsProvider>
    </ThemeProvider>
  );
}
```

All customization happens through the `components` prop of `<Launchpad />` - you shouldn't need to touch the
provider chain above.

## Customization

### 1. Replacing the default io.Connect Desktop Launchpad with a custom implementation

For details on how io.Connect Desktop discovers and loads a custom Launchpad app, see the
[Launchpad documentation](https://docs.interop.io/desktop/capabilities/launcher/index.html#launchpad).


### 2. The `components` prop

`<Launchpad components={{ ... }} />` forwards straight to the native `IOLaunchpad.ContentsContainer`, so it only
accepts `header` (`BeforeSearch` / `AfterSearch`) and `sections` - there's no per-piece override system.
`DragHandle`, `LogoButton`, `NotificationsButton`, `MainContextMenu`, `ExtendedArea` are exported standalone so you
compose them yourself into `header.BeforeSearch` / `AfterSearch`, as shown above.

> **Tip:** define `BeforeSearch` / `AfterSearch` (and the `components` object) **outside** your component's render
> function (module scope), or memoize them. Passing a brand-new inline function on every render forces
> `<Launchpad />` to remount that zone on every render - wasteful in general, and it can also break in-flight
> async work started by a piece inside it (e.g. opening the docked search popup).

### 3. Default `BeforeSearch` / `AfterSearch`

`<Launchpad />` fills in `header.BeforeSearch` / `AfterSearch` with its own defaults whenever you don't specify
them, so there are 3 possible outcomes per zone:

1. **Omitted** (key not present, or `undefined`) - the library default renders (`DragHandle` + `LogoButton` for
   `BeforeSearch`; `ExtendedArea` + `NotificationsButton` + `MainContextMenu` for `AfterSearch`).
2. **Explicitly empty** (e.g. `BeforeSearch: () => null`) - the default is overridden and nothing renders in that
   zone.
3. **A real custom component** - that component renders in place of the default.

```tsx
// 1. Omitted - renders the library defaults
<Launchpad />;

// 2. Explicitly empty - hides the zone entirely
<Launchpad components={{ header: { AfterSearch: () => null } }} />;

// 3. Custom component - fully replaces the zone
function CustomBeforeSearch() {
  return <MyCustomLogo />;
}

<Launchpad components={{ header: { BeforeSearch: CustomBeforeSearch } }} />;
```

### 4. Removing a piece

Since `header.BeforeSearch` / `AfterSearch` **fully replace** the zone, just omit a piece from your composition to
hide it - e.g. hide the notifications bell:

```tsx
function AfterSearch() {
  return (
    <>
      <ExtendedArea />
      <MainContextMenu />
    </>
  );
}
```

### 5. Passing your own component

Compose your own implementation alongside (or instead of) the default pieces:

```tsx
function MyMainContextMenu() {
  return <button onClick={() => console.log("clicked!")}>⋮</button>;
}

function AfterSearch() {
  return (
    <>
      <ExtendedArea />
      <NotificationsButton />
      <MyMainContextMenu />
    </>
  );
}
```

### 6. Overriding `BeforeSearch` / `AfterSearch`

Pass `components.header` to fully replace either zone with something entirely custom:

```tsx
function CustomBeforeSearch() {
  return <MyCustomLogo />;
}

function CustomAfterSearch() {
  return <MyCustomButton />;
}

const launchpadComponents = { header: { BeforeSearch: CustomBeforeSearch, AfterSearch: CustomAfterSearch } };

<Launchpad components={launchpadComponents} />;
```

Since `header.BeforeSearch` / `AfterSearch` **fully replace** the zone, if you just want to add something
alongside the defaults, import the default pieces (they're also exported standalone) and compose them yourself:

```tsx
import { IOLaunchpadDesktop } from "@interopio/components-react";

const { DragHandle, LogoButton } = IOLaunchpadDesktop;

function CustomBeforeSearch() {
  return (
    <>
      <DragHandle />
      <LogoButton />
      <MyExtraBadge />
    </>
  );
}

const launchpadComponents = { header: { BeforeSearch: CustomBeforeSearch } };
```

### 7. Customizing the `LogoButton`

`LogoButton` itself accepts `icon`, `iconSrc`, and `onClick` props, so you don't need to replace it entirely just
to change the logo or its click behavior:

```tsx
import { IOLaunchpadDesktop } from "@interopio/components-react";

const { DragHandle, LogoButton } = IOLaunchpadDesktop;

function BeforeSearch() {
  return (
    <>
      <DragHandle />
      <LogoButton iconSrc="/my-logo.png" onClick={() => console.log("logo clicked")} />
    </>
  );
}
```

- `icon` — an icon variant name (ignored if `iconSrc` is set); defaults to `"logo"`.
- `iconSrc` — a custom image URL/data-URI to render instead of `icon`.
- `onClick` — replaces the default collapse/popup-toggle behavior; drag-to-move still works either way.

### 7. `ExtendedArea` visibility

`ExtendedArea` self-guards: it renders `null` unless the Launchpad is both docked and the
`LAUNCHPAD_SHOW_EXTENDED_AREA` platform pref is enabled, so it's safe to always include it in `AfterSearch` - it
simply won't render anything otherwise.
