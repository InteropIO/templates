# Web Group App for io.Connect Desktop

Template for creating a [custom Web Group App](https://docs.interop.io/desktop/capabilities/windows/window-management/overview/index.html#extending_web_groups) for **io.Connect Desktop**.

## Prerequisites

For an **io.Connect Desktop** project, **io.Connect Desktop** 9.0 or newer is required.

## Usage

- Run `npm install` to install all dependencies.
- Run `npm run start` to start the app.
- Open the `webGroup.json` definition file located in the `%LocalAppData%\interop.io\io.Connect Desktop\Desktop\config\apps` folder, set the `"disabled"` property to `false`, and set the `"url"` property of the `"details"` top-level key to the location of your Web Group App (the default is `http://localhost:3000`).
- Set the `"groupType"` property of the `stickywindows.json` file located in `%LocalAppData%\interop.io\io.Connect Desktop\Desktop\config` to `"Web"`.
- Start **io.Connect Desktop** to start using and modifying your Web Group App.
