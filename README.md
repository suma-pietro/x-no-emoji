# x-no-emoji

An enhanced Chrome extension that gives you control over tweets from users who have emojis in their display names on X (formerly Twitter).

## Description

This extension cleans up your X/Twitter feed by letting you choose how to handle tweets from users with emojis in their names. Instead of just hiding them, you can now choose to **hide** them completely, **blur** them to reduce distraction, or turn the filter **off**. The filtering happens in real-time as you scroll.

## Features

  - **Multiple Filtering Modes**: Choose between **Hide**, **Blur**, or **Off**.
  - **User-Friendly Popup**: A simple popup menu to easily switch between modes.
  - **Settings are Saved**: Your chosen preference is saved and applied automatically across browser sessions.
  - **Real-time Filtering**: New tweets are filtered instantly as you scroll your timeline.
  - **High Performance**: Built with `MutationObserver` for minimal impact on browsing speed.
  - **Console Logging**: Tracks filtered tweets in the developer console for debugging.

## Installation

### From Source

1.  Clone this repository:


```bash
git clone https://github.com/suma-pietro/x-location-filter.git
```

1.  Open Chrome and navigate to `chrome://extensions/`
2.  Enable "Developer mode" in the top right corner.
3.  Click "Load unpacked" and select the extension directory.

## How It Works

The extension uses a DOM-based approach to filter tweets:

  - **Monitors** the page for new tweets using `MutationObserver`.
  - **Checks** user display names for emoji characters (which X/Twitter renders as `<img>` tags).
  - **Fetches** the user's saved preference (Hide, Blur, or Off) from `chrome.storage`.
  - **Applies** the corresponding action:
      - **Hide**: Adds a CSS class to set `display: none;` on the tweet.
      - **Blur**: Adds a CSS class to apply a `filter: blur(5px);` effect to the tweet.
      - **Off**: Takes no action.
  - **Logs** filtered tweets (both hidden and blurred) to the console for debugging purposes.

## Files Structure

```
├── manifest.json     # Extension configuration and permissions
├── content.js        # Main filtering logic injected into the page
├── popup.html        # The popup interface (HTML structure)
├── popup.js          # Handles logic for the popup (saving settings)
└── README.md         # This documentation file
```

## Technical Details

  - Uses `MutationObserver` to efficiently detect dynamically loaded content.
  - Uses `chrome.storage.sync` to save and sync user settings.
  - Targets specific X/Twitter DOM elements:
      - `article[data-testid="tweet"]` for tweet containers.
      - `div[data-testid="User-Name"]` for user names.
  - Marks processed tweets with `data-emoji-filter-processed` attribute to avoid redundant checks.
  - Injects CSS classes (`.ef-hidden`, `.ef-blurred`) for clean and efficient filtering instead of manipulating inline styles.

## Development

To modify or enhance the extension:

1.  Make your changes to the relevant files.
2.  Go to `chrome://extensions/` and click the "Reload" icon for the extension.
3.  Test the changes on X/Twitter.


## Version History

  - **2.0.0 (2025-10-02)**

      - **NEW**: Added filtering modes. Users can now choose to **Blur** tweets instead of only hiding them.
      - **NEW**: Introduced a popup interface to easily switch between modes (Hide, Blur, Off).
      - **NEW**: Settings are now saved using `chrome.storage.sync`.
      - Refactored filtering logic to use CSS classes for better performance and maintainability.

  - **1.0.0 (2025-10-01)**

      - Initial release.
      - Basic functionality to hide tweets from users with emojis in their names.
      - Console logging for filtered tweets.