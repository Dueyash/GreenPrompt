# Green Prompt - Quick Start Guide 🌱

## Installation & Testing

### 1. Load the Extension
1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select this folder: `deepseek-chat-exporter`
5. Extension should appear with 🌱 icon

### 2. Verify Installation
Open the extension popup and you should see:
- ✅ "Green Prompt" title with green theme
- ✅ Privacy-First Chat Storage tagline
- ℹ️ Message: "📍 Please visit chat.deepseek.com..."

Check browser console (F12 → Console tab):
```
[Green Prompt] 🌱 Installed - Privacy-first, local-only storage
[Green Prompt] 🔒 All data stored locally in IndexedDB
[Green Prompt] 🚫 Zero external network requests
```

### 3. Test on DeepSeek Chat

#### Visit Chat Page
1. Navigate to: `https://chat.deepseek.com/`
2. Open DevTools Console (F12)
3. Look for initialization messages:
```
[Green Prompt] Initializing on DeepSeek chat page
[Green Prompt DB] ✅ Database ready
[Green Prompt] ✅ Real-time monitoring active - Messages will be auto-saved
[Green Prompt] 💾 Saving X existing messages...
```

#### Start Chatting
1. Send a message (e.g., "Hello, how are you?")
2. Watch console for:
```
[Green Prompt] ✅ Saved user message
[Green Prompt] ✅ Saved assistant message
```

#### Check Stats in Popup
1. Click the 🌱 extension icon
2. You should see:
   - Total Chats: **1**
   - Total Messages: **2** (or more)
3. Export buttons should be **enabled**

### 4. Test Export Functionality

#### From Popup
1. Click extension icon
2. Click any export button (JSON, Markdown, HTML, Text)
3. File should download
4. Status message: "Export completed as [FORMAT]!"

#### Verify Export
- **JSON**: Open in text editor, verify structure
- **Markdown**: Check formatting, code blocks
- **HTML**: Open in browser, check styling
- **Text**: Plain text format

### 5. Inspect Database

#### Chrome DevTools Method
1. Open DevTools (F12) on chat.deepseek.com
2. Go to **Application** tab
3. Navigate: **Storage** → **IndexedDB** → **DeepSeekChatDB**
4. Expand to see:
   - **chats** store (metadata)
   - **messages** store (all messages)
5. Click any entry to view/edit data

#### Console Method
Run in console on chat.deepseek.com:
```javascript
// View stats
chatDB.getStats().then(console.log);

// View current chat
chatDB.getChatData().then(console.log);

// View all chats
chatDB.getAllChats().then(console.log);

// Export everything
chatDB.exportDatabase().then(console.log);
```

## Troubleshooting

### Issue: Extension Not Detecting Page
**Symptoms:**
- Popup shows "📍 Please visit chat.deepseek.com..."
- No console messages on DeepSeek page

**Solutions:**
1. Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Reload extension: Go to `chrome://extensions/` → Click reload button
3. Check URL: Must be exactly `https://chat.deepseek.com/*`

### Issue: No Messages Being Saved
**Symptoms:**
- Stats show 0 chats, 0 messages
- No console messages when chatting

**Solutions:**
1. Check console for errors
2. Verify you're on a chat page (not homepage)
3. Reload extension and refresh page
4. Check IndexedDB in DevTools to confirm database exists

### Issue: Export Buttons Disabled
**Symptoms:**
- Export buttons are grayed out
- Can't click export

**Solutions:**
1. Make sure you're on `chat.deepseek.com`
2. Refresh the popup
3. Must be on an active chat page, not settings/home

### Issue: Stats Not Updating
**Symptoms:**
- Stats stuck at old numbers
- Added messages but count doesn't increase

**Solutions:**
1. Close and reopen popup
2. Refresh the page
3. Check DevTools → Application → IndexedDB manually

## Expected Console Output

### On Extension Load
```
[Green Prompt] 🌱 Installed - Privacy-first, local-only storage
[Green Prompt] 🔒 All data stored locally in IndexedDB
[Green Prompt] 🚫 Zero external network requests
```

### On Page Load (chat.deepseek.com)
```
[Green Prompt] Initializing on DeepSeek chat page
[Green Prompt DB] ✅ Database ready
[Green Prompt] ✅ Real-time monitoring active - Messages will be auto-saved
[Green Prompt] 💾 Saving X existing messages...
```

### When Chatting
```
[Green Prompt] ✅ Saved user message
[Green Prompt] ✅ Saved assistant message
```

### When Exporting
```
[Green Prompt] Exporting as [format]...
```

## Privacy Verification

### Network Tab Check
1. Open DevTools → **Network** tab
2. Filter: Show only XHR/Fetch
3. Use the extension (chat, export, etc.)
4. **Expected**: NO requests from extension files
5. Only DeepSeek's own API calls should appear

### Storage Check
Run in console:
```javascript
// Extension makes zero network requests
// All this data is LOCAL ONLY
indexedDB.databases().then(dbs => {
  console.log('Databases:', dbs);
  // Should show: DeepSeekChatDB
});
```

## Success Criteria

✅ Extension loads without errors  
✅ Green theme popup displays correctly  
✅ Stats show correct numbers  
✅ Messages auto-save in real-time  
✅ All 4 export formats work  
✅ Data visible in IndexedDB  
✅ Zero network requests from extension  
✅ Console shows green [Green Prompt] messages  

## Need Help?

Check the full documentation:
- [README.md](README.md) - Feature overview
- [TESTING.md](TESTING.md) - Detailed testing guide
- [PRIVACY.md](PRIVACY.md) - Privacy policy

Happy chatting! 🌱
