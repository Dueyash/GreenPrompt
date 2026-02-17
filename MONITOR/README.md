# Green Prompt 🌱

A **privacy-first**, local-only Chrome extension that automatically stores your DeepSeek chat conversations in real-time using IndexedDB.

## 🔒 Privacy First

- ✅ **100% Local Storage** - All data stored in your browser's IndexedDB
- ✅ **Zero Network Requests** - No external connections or API calls
- ✅ **No Permissions Required** - Runs without any Chrome permissions
- ✅ **No Data Collection** - We cannot access your data
- ✅ **Open Source** - Fully auditable code
- ✅ **No Dependencies** - No third-party code or CDN requests

[Read Full Privacy Policy](PRIVACY.md)

## Features

- **Real-time Chat Storage**: Automatically captures and stores all messages as you chat
- **IndexedDB Database**: High-performance, inspectable local storage
- **Persistent & Private**: All conversations saved locally in your browser
- **Multiple Export Formats**:
  - JSON: Structured data format for programmatic use
  - Markdown: Readable format with support for code blocks and formatting
  - HTML: Beautifully styled format with light/dark mode support
  - Plain Text: Simple text format for maximum compatibility
- **Storage Statistics**: View total chats and messages stored
- **Simple Export**: One-click export from stored data with format selection
- **Zero Permissions**: Most private extension possible

## Installation

### From Chrome Web Store

1. Visit the [DeepSeek Chat Conversations Exporter](https://chrome.google.com/webstore/detail/deepseek-chat-exporter/mgmakgggdndagmammflkidclcckiijmk) page in the Chrome Web Store
2. Click "Add to Chrome" to install the extension
3. The extension is now installed and will activate when you visit DeepSeek Chat

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension is now installed and will activate when you visit DeepSeek Chat

## Usage

1. Visit any DeepSeek chat page
2. The extension automatically monitors and stores all messages in real-time
3. Click the extension icon to view storage statistics (total chats and messages)
4. Click the "Export Chat" button on the chat page to export the current conversation
5. Select your preferred export format (JSON, Markdown, HTML, or Text)
6. The conversation will be downloaded from the stored data in your chosen format

## How It Works

The extension uses a **MutationObserver** to monitor the DeepSeek chat interface in real-time. When new messages appear:

1. Messages are immediately extracted and processed
2. Stored in **IndexedDB** (`DeepSeekChatDB`) with proper metadata (title, URL, timestamp)
3. Available for instant export without re-scraping the page

### Database Structure

**IndexedDB Database**: `DeepSeekChatDB`

**Object Stores**:
- `chats`: Stores chat metadata (chatId, title, URL, messageCount, timestamps)
- `messages`: Stores individual messages (content, role, timestamp, chain_of_thought)

**Indexes**:
- Fast lookup by chatId
- Chronological sorting by timestamp
- Duplicate detection by element_id

This approach ensures:
- ✅ No messages are lost
- ✅ Faster export times
- ✅ Consistent data structure
- ✅ Ability to export even after page refresh
- ✅ Inspectable in Chrome DevTools

## Viewing Your Data

### Chrome DevTools (Recommended)
1. Open DevTools (F12) on chat.deepseek.com
2. Go to **Application** tab
3. Navigate to **IndexedDB** → **DeepSeekChatDB**
4. Expand to see `chats` and `messages` object stores
5. Click to view, edit, or delete any data

### Extension Popup
- Click the extension icon to see statistics
- View total number of chats and messages stored locally

## Data Management

### Export All Data
Send a message to the content script:
```javascript
chrome.tabs.sendMessage(tabId, { action: 'exportAllData' }, (response) => {
  console.log(response.data);
});
```

### Clear All Data
**Option 1**: Chrome Settings
1. Go to `chrome://settings/siteData`
2. Search for "chat.deepseek.com"  
3. Click "Remove"

**Option 2**: DevTools Console
```javascript
indexedDB.deleteDatabase('DeepSeekChatDB');
```

## Privacy & Security

### What Data is Stored?
- Chat messages (user questions, AI responses, thinking process)
- Chat metadata (title, URL, timestamps)
- Message ordering and relationships

### Where is Data Stored?
- **Location**: IndexedDB in browser, scoped to `chat.deepseek.com` origin
- **Physical Path**: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB\`
- **Accessible By**: Only you, through your browser

### What We DON'T Do
- ❌ No cloud storage or syncing
- ❌ No external network requests
- ❌ No analytics or telemetry  
- ❌ No user tracking
- ❌ No data collection of any kind

**Complete Privacy**: Your conversations never leave your browser.

See [PRIVACY.md](PRIVACY.md) for full privacy policy.

## Support

If you find this extension useful, please consider supporting the development:

- ⭐ Star the [GitHub repository](https://github.com/ypyf/deepseek-chat-exporter)
- 🐛 Report bugs or suggest features in the [Issues section](https://github.com/ypyf/deepseek-chat-exporter/issues)
- 🔄 Share the extension with others who might find it helpful
- 🍵 [请我喝杯奶茶](https://planetbee.xyz/deepseek-chat-exporter/buy-me-a-coffee/).

Your support helps maintain and improve this extension!

## License

MIT
