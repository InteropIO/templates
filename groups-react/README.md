# Web Group App for io.Connect Desktop

Template for creating a [custom Web Group App](https://docs.interop.io/desktop/capabilities/windows/window-management/overview/index.html#extending_web_groups) for **io.Connect Desktop**.

## Prerequisites

For a **io.Connect Desktop** project, you need to have **io.Connect Desktop** 9.0 or newer is required.

## Usage

- Run `npm install` to install all dependencies.
- Run `npm run start` to start the app.
- Copy the `webGroup.json` configuration file and replace the existing Web Group App definition in the `%LocalAppData%\interop.io\io.Connect Desktop\Desktop\config\apps` folder.
- Set the `"groupType"` property of the `stickywindows.json` file of **io.Connect Desktop** to `"Web"`.
- Start **io.Connect Desktop** to start using and modifying your Web Group App.
