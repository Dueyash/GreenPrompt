# Testing Guide - DeepSeek Chat Exporter v2.0.0

## Quick Start Testing

### 1. Load the Extension
```bash
# Open Chrome and go to:
chrome://extensions/

# Enable "Developer mode" (top right toggle)
# Click "Load unpacked"
# Select the extension folder: deepseek-chat-exporter/
```

### 2. Verify Installation
- Extension should appear in Chrome toolbar
- No permission warnings should appear (we use zero permissions!)
- Check console for: `[DeepSeek Chat Exporter] Installed - Privacy-first, local-only storage`

### 3. Visit DeepSeek Chat
```bash
# Navigate to:
https://chat.deepseek.com/

# Open DevTools Console (F12)
# Look for initialization messages:
# - "[ChatDB] Database opened successfully"
# - "[ChatExporter] Starting real-time monitoring..."
```

## Testing Real-Time Storage

### Start a New Chat
1. Create a new chat on DeepSeek
2. Send a message (e.g., "Hello, how are you?")
3. Watch the console for:
   ```
   [ChatExporter] Saving 2 existing messages...
   [ChatDB] Saved user message to [chat-id]
   [ChatDB] Saved assistant message to [chat-id]
   [ChatExporter] New user message saved
   [ChatExporter] New assistant message saved
   ```

### Verify Real-Time Capture
1. Continue conversation (send 2-3 more messages)
2. Each message should trigger:
   - `[ChatDB] Saved [role] message to [chat-id]`
   - `[ChatExporter] New [role] message saved`

### Test Message Detection
- User messages: Should be captured immediately when sent
- AI responses: Should be captured as they appear (even streaming)
- Thinking process: Should be captured if present

## Inspecting the Database

### Method 1: Chrome DevTools (Recommended)
1. Open DevTools (F12) on chat.deepseek.com
2. Go to **Application** tab
3. Navigate: **Storage** → **IndexedDB** → **DeepSeekChatDB**
4. You should see:
   - `chats` object store (chat metadata)
   - `messages` object store (all messages)

#### Inspect Chats Store
```
DeepSeekChatDB → chats → [click any entry]

Expected structure:
{
  chatId: "abc-123-def-456",
  title: "Your Chat Title",
  url: "https://chat.deepseek.com/chat/abc-123-def-456",
  lastUpdated: "2026-02-17T12:34:56.789Z",
  messageCount: 5,
  firstMessage: "2026-02-17T12:30:00.000Z"
}
```

#### Inspect Messages Store
```
DeepSeekChatDB → messages → [click any entry]

Expected structure (user message):
{
  id: 1,
  chatId: "abc-123-def-456",
  role: "user",
  content: "Your question here",
  element_id: "user-0-1234567890",
  timestamp: "2026-02-17T12:30:00.000Z"
}

Expected structure (assistant message):
{
  id: 2,
  chatId: "abc-123-def-456",
  role: "assistant",
  content: "AI response in markdown format",
  chain_of_thought: "Thinking process if available",
  element_id: "ai-1-1234567891",
  timestamp: "2026-02-17T12:30:05.000Z"
}
```

### Method 2: Console API
Open DevTools Console on chat.deepseek.com:

```javascript
// Get database statistics
chatDB.getStats().then(stats => {
  console.log('Statistics:', stats);
  // Expected: { totalChats: 1, totalMessages: 5 }
});

// Get current chat data
chatDB.getChatData().then(data => {
  console.log('Current Chat:', data);
  console.log('Messages:', data.messages);
});

// Get all chats
chatDB.getAllChats().then(chats => {
  console.log('All Chats:', chats);
});

// Export entire database
chatDB.exportDatabase().then(data => {
  console.log('Full Export:', data);
});
```

## Testing Export Functionality

### Test Export Button
1. Look for "Export Chat" button on the page (bottom-right usually)
2. Click the button to open dropdown
3. Verify 4 export options appear:
   - 📄 Export as JSON
   - 📝 Export as Markdown
   - 🌐 Export as HTML
   - 📃 Export as Plain Text

### Test Each Format

#### JSON Export
1. Click "Export as JSON"
2. File should download: `[Chat Title].json`
3. Open file and verify structure:
```json
{
  "title": "Your Chat Title",
  "url": "https://...",
  "date": "2026-02-17T...",
  "messages": [
    {
      "role": "user",
      "content": "..."
    },
    {
      "role": "assistant",
      "content": "...",
      "chain_of_thought": "..."
    }
  ]
}
```

#### Markdown Export
1. Click "Export as Markdown"
2. File should download: `[Chat Title].md`
3. Open in text editor and verify:
   - Chat title as H1
   - Metadata section
   - Messages with role headers
   - Code blocks preserved
   - Thinking process in collapsible sections

#### HTML Export
1. Click "Export as HTML"
2. File should download: `[Chat Title].html`
3. Open in browser and verify:
   - Styled conversation
   - Light/dark mode support
   - Proper formatting

#### Text Export
1. Click "Export as Plain Text"
2. File should download: `[Chat Title].txt`
3. Open and verify plain text format

## Testing Extension Popup

### Open Popup
1. Click the extension icon in Chrome toolbar
2. Popup should show:
   - Extension title
   - Description about local storage
   - **Statistics section** with:
     - Total Chats: [number]
     - Total Messages: [number]
     - 🔒 Privacy note
   - Support link
   - Version: v2.0.0

### Verify Statistics
1. Open popup while on chat.deepseek.com
2. Numbers should match your data
3. If not on DeepSeek: should show "Visit DeepSeek Chat"
4. After adding messages: refresh popup, numbers should update

## Privacy Testing

### Verify Zero Permissions
```bash
# Check manifest.json
# "permissions": [] should be empty array
# No storage, tabs, or other permissions listed
```

### Verify No Network Requests
1. Open DevTools → Network tab
2. Filter: Show "All" or "XHR/Fetch"
3. Use the extension (capture messages, export, etc.)
4. **Expected**: NO network requests made by extension
5. You should only see DeepSeek's own API calls

### Verify No External Resources
1. Check Network tab for any CDN requests
2. Extension should NOT load:
   - No libraries from cdnjs, unpkg, etc.
   - No Google Analytics
   - No external fonts
   - No tracking pixels

### Inspect Background Script
```bash
# Open:
chrome://extensions/

# Find the extension
# Click "service worker" link (under "Inspect views")
# Console should show:
# "[DeepSeek Chat Exporter] Installed - Privacy-first, local-only storage"
# "[Privacy] All data stored locally in IndexedDB at chat.deepseek.com origin"
# "[Privacy] No external network requests, no data collection"
```

## Data Management Testing

### Test Data Persistence
1. Capture some messages
2. Close the browser completely
3. Reopen Chrome
4. Visit the chat page
5. Open DevTools → Application → IndexedDB
6. **Expected**: All data should still be there

### Test Data Deletion

#### Method 1: Clear Specific Chat
```javascript
// In console on chat.deepseek.com:
chatDB.clearChat(); // Clears current chat
// Verify in IndexedDB that chat and messages are gone
```

#### Method 2: Clear All Data
```javascript
// In console on chat.deepseek.com:
chatDB.clearAllChats();
// Verify in IndexedDB that all stores are empty
```

#### Method 3: Browser Settings
1. Go to `chrome://settings/siteData`
2. Search: "chat.deepseek.com"
3. Click "Remove"
4. Verify in DevTools that IndexedDB is deleted

### Test Multiple Chats
1. Create 3 different chats
2. Send messages in each
3. Check statistics (should show 3 chats, X messages)
4. Export from each chat (should export only that chat's data)
5. Check IndexedDB (should have 3 entries in `chats` store)

## Edge Cases Testing

### Empty Chat
1. Open a new chat (no messages)
2. Try to export
3. **Expected**: Alert "No messages found in database"

### Large Chat (Performance)
1. Have a conversation with 50+ messages
2. Verify all messages captured
3. Export should be fast (< 1 second)
4. Check memory usage (should be reasonable)

### Special Characters
1. Send messages with:
   - Emojis: 🎉 🚀 💻
   - Code blocks with special chars: `<>&"'`
   - Math equations: `$E=mc^2$`
   - Markdown formatting: **bold**, *italic*, [links]
2. Verify stored correctly in IndexedDB
3. Verify exports correctly in all formats

### Rapid Messages
1. Send multiple messages quickly (paste 5 questions in a row)
2. Verify all captured without duplicates
3. Check element_id uniqueness in IndexedDB

### Page Reload
1. Start a chat, send messages
2. Reload the page (F5)
3. Send more messages
4. Verify:
   - Old messages still in database
   - New messages added
   - No duplicates created

### Extension Update
1. Note current data in IndexedDB
2. Reload extension (`chrome://extensions/` → reload button)
3. Verify data still intact
4. Send new messages, verify capture still works

## Console Testing

### Check for Errors
Throughout testing, monitor console for:
- ❌ No JavaScript errors
- ❌ No failed IndexedDB transactions
- ❌ No network errors (should be none!)
- ✅ Only expected log messages

### Expected Console Messages
```
[ChatDB] Database opened successfully
[ChatDB] Created chats store
[ChatDB] Created messages store
[ChatExporter] Starting real-time monitoring...
[ChatExporter] Saving X existing messages...
[ChatDB] Saved user message to [chat-id]
[ChatDB] Saved assistant message to [chat-id]
[ChatExporter] New user message saved
[ChatExporter] New assistant message saved
```

## Browser Storage Inspection

### Check Storage Usage
```javascript
// In console on chat.deepseek.com:
navigator.storage.estimate().then(estimate => {
  console.log('Storage used:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
  console.log('Storage quota:', (estimate.quota / 1024 / 1024 / 1024).toFixed(2), 'GB');
});
```

### Verify Storage Location
- Windows: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB\`
- Look for folder containing `chat.deepseek.com`
- Should see LevelDB files (`.ldb`, `.log`)

## Regression Testing Checklist

After any code changes, verify:
- [ ] Extension loads without errors
- [ ] Database initializes correctly
- [ ] Messages are captured in real-time
- [ ] No duplicate messages
- [ ] Export button appears
- [ ] All 4 export formats work
- [ ] Popup shows correct statistics
- [ ] No network requests made
- [ ] No console errors
- [ ] Data persists across reloads
- [ ] Multiple chats work independently
- [ ] Privacy policy accurate

## Debugging Tips

### If messages aren't being captured:
1. Check console for initialization messages
2. Verify MutationObserver is running
3. Check if selectors still match DOM (DeepSeek may change classes)
4. Verify `extractAllMessagesFromPage()` returns data

### If export fails:
1. Check if database has messages
2. Verify conversion functions work
3. Check for JavaScript errors in console
4. Try different export format

### If popup shows wrong stats:
1. Verify you're on chat.deepseek.com
2. Check if messaging is working (content script ↔ popup)
3. Refresh the popup
4. Check console in popup (right-click popup → Inspect)

### If IndexedDB is empty:
1. Verify database initialization messages
2. Check if `chatDB.saveMessage()` is being called
3. Look for IndexedDB errors in console
4. Try deleting database and reloading extension

## Performance Benchmarks

Expected performance targets:
- **Database initialization**: < 100ms
- **Message capture**: < 50ms per message
- **Export (50 messages)**: < 500ms
- **Statistics query**: < 100ms
- **Memory usage**: < 50MB for 1000 messages

Test with:
```javascript
console.time('Export');
exportChat('json');
console.timeEnd('Export');
```

## Success Criteria

Extension is working correctly if:
- ✅ Messages captured in real-time
- ✅ Data visible in IndexedDB
- ✅ All export formats work
- ✅ Popup shows accurate stats
- ✅ No errors in console
- ✅ No network requests
- ✅ Zero permissions required
- ✅ Data persists correctly
- ✅ Clean uninstall possible

Happy testing! 🧪
