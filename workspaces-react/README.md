# Workspaces App for io.Connect Desktop

Template for creating a custom Workspaces App [for **io.Connect Desktop**](https://docs.interop.io/desktop/capabilities/windows/workspaces/overview/index.html#extending_workspaces) or [for **io.Connect Browser**](https://docs.interop.io/browser/capabilities/windows/workspaces/workspaces-app/index.html) projects.

## Prerequisites

For an **io.Connect Desktop** project, **io.Connect Desktop** 9.0 or newer is required. For an **io.Connect Browser**
project, **io.Connect Browser** 3.0 or newer is required.

## Usage

- Run `npm install` to install all dependencies.
- Run `npm run start` to start the app.
- For **io.Connect Desktop** projects, open the `workspaces.json` definition file located in the `%LocalAppData%\interop.io\io.Connect Desktop\Desktop\config\apps` folder, add a `"url"` property under the `"details"` top-level key of the Workspaces UI app definition and set it to the location of your Workspaces App (the default is `http://localhost:5173`). For **io.Connect Browser** projects, see the [Enabling Workspaces](https://docs.interop.io/browser/capabilities/windows/workspaces/enabling-workspaces/index.html) documentation.
- Start **io.Connect Desktop** or **io.Connect Browser** to start using and modifying your Workspaces App.
