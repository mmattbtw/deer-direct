# Deer Direct - Chrome Extension

A Chrome extension that automatically redirects any links from `bsky.app/*` to a configurable destination (default: `deer.social/*`).

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now automatically redirect bsky.app links to your chosen destination

## Settings

- Open the extension's Options page to change the destination domain.
- Only enter the domain (no protocol or path), e.g. `deer.social`.
- Changes apply immediately to new requests and page links.
