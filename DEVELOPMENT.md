# Development Documentation

Welcome to the **StartPageExtension** project! This document acts as a guide for developers to understand the project structure, how to run it locally, and how to contribute to its development.

## 1. Project Overview

**StartPageExtension** is a Chrome Extension that overrides the "New Tab" page. It provides a personalized dashboard with features like:

- **Customizable Backgrounds & Themes**: Choose from various built-in themes.
- **Productivity Tools**: Embedded NotePad, To-Do List.
- **Widgets (iFrames)**: Mini-apps like Calculator, Timer, Translator, and more.
- **Bookmarks & History**: Quick access to your browser data.
- **Voice Search**: Integrated voice search functionality.

The project is built with **Vanilla HTML, CSS, and JavaScript**. No build step (like Webpack or Vite) is currently required, making it easy to pick up and modify.

## 2. Prerequisites

To work on this project, you need:

- **Web Browser**: Google Chrome (or any Chromium-based browser like Brave, Edge).
- **Code Editor**: VS Code (recommended) or any text editor of your choice.

## 3. Setup / Installation

Since there is no build process, "installing" the project for development is straightforward:

1.  **Clone the Repository** (or download the source code).
2.  **Open Chrome Extensions Page**:
    - Navigate to `chrome://extensions/` in your browser.
    - Toggle **Developer mode** in the top right corner.
3.  **Load Unpacked**:
    - Click the **Load unpacked** button.
    - Select the root directory of this project (where `manifest.json` is located).
4.  **Verify**:
    - Open a new tab. You should see the StartPageExtension running.

> **Tip**: After making changes to the code (especially `manifest.json` or background scripts), go back to `chrome://extensions/` and click the reload icon for this extension to apply changes. For simple HTML/CSS/JS changes in the new tab page, refreshing the new tab is usually enough.

## 4. Project Structure

Here is an overview of the key files and directories:

### Root Directory

- **`manifest.json`**: The configuration file required by Chrome. defines permissions (`tabs`, `storage`, etc.), the new tab override, and content security policies.
- **`index.html`**: The main entry point for the New Tab page. Contains the skeleton of the dashboard.

### `script/`

Contains the core JavaScript logic. Key files include:

- **`script/settings.js`**: Manages the settings modal, loading/saving user preferences.
- **`script/themes.js`**: Handles applying themes to the main page.
- **`script/iframe-theme-loader.js`**: A helper to ensure themes propagate to iframe widgets.
- **`script/bookmarks.js` / `script/history.js`**: Interact with Chrome APIs to fetch user data.
- **`script/notepad.js` / `script/gamesnotepadtodolist.js`**: Logic for the built-in productivity tools.

### `style/`

Contains the CSS stylesheets.

- **`style/style.css`**: Main styles for the dashboard.
- **`style/settingsstyle.css`**: Specific styles for the settings configuration menu.
- **`style/themes/`**: (If applicable) Directory for individual theme CSS files.

### `iFrames/`

Contains standalone mini-applications that are embedded into the main dashboard via `<iframe>`.

- **Examples**: Calculator, Timer, Calendar.
- **Structure**: Each iframe usually has its own `.html`, `.css`, and `.js` files within this directory.

## 5. Key Concepts

### Theming System

The extension supports dynamic theming.

- **Main Page**: Themes are applied by injecting CSS or changing CSS variables. `script/themes.js` handles the logic of selecting and applying the active theme.
- **iFrames**: Since iframes are isolated, we use `script/iframe-theme-loader.js` (or similar logic within the iframe) to listen for theme changes from the parent window and apply the corresponding styles.

### Data Persistence

We use **`chrome.storage.local`** (and occasionally `localStorage`) to save user preferences, notes, and to-do items. This ensures data persists across browser restarts.

## 6. Contribution Guidelines

1.  **Code Style**: Keep code clean and readable. Use meaningful variable names.
2.  **No Build Step**: Try to maintain the "no build step" philosophy unless necessary. It keeps the project accessible.
3.  **Testing**: Before submitting changes, manually test:
    - The feature you added.
    - Settings saving/loading.
    - Responsiveness (resize the window).
    - Console for any errors.
