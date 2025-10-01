# X Emoji-Free Name Filter

A Chrome extension that filters out tweets from users who have emojis in their display names on X (formerly Twitter).

## Description

This extension provides a cleaner X/Twitter feed by automatically hiding tweets from users who use emojis in their display names. It works in real-time and filters tweets as you scroll through your timeline.

## Features

- Automatically hides tweets from users with emojis in their names
- Works with all types of emojis (including flags and other special characters)
- Real-time filtering as new tweets load
- Minimal performance impact
- Console logging for tracking filtered tweets

## Installation

### From Source
1. Clone this repository:
```bash
git clone https://github.com/suma-pietro/x-no-emoji.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## How It Works

The extension uses a DOM-based approach to filter tweets:
- Monitors the page for new tweets using `MutationObserver`
- Checks user display names for emoji characters (rendered as `<img>` tags by X/Twitter)
- Automatically hides tweets from users with emojis in their names
- Logs filtered tweets to the console for debugging purposes

## Files Structure

```
├── manifest.json        # Extension configuration and permissions
├── content.js          # Main filtering logic
├── popup.html          # Extension popup interface
├── README.md          # Documentation
```

## Technical Details

- Uses MutationObserver to detect dynamically loaded content
- Targets specific X/Twitter DOM elements:
  - `article[data-testid="tweet"]` for tweet containers
  - `div[data-testid="User-Name"]` for user names
- Marks processed tweets with `data-emoji-filter-processed` attribute to avoid re-processing

