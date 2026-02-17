# Privacy Policy - DeepSeek Chat Exporter

**Last Updated:** February 17, 2026  
**Version:** 2.0.0

## Our Commitment to Privacy

DeepSeek Chat Exporter is built with privacy as the **top priority**. This extension operates on a simple principle: **your data stays with you**.

## Data Storage

### What We Store
- Chat conversations from DeepSeek Chat
- Message content (user questions and AI responses)
- Chat metadata (title, URL, timestamps)
- Message timestamps and ordering

### Where Data is Stored
All data is stored **exclusively in your browser** using IndexedDB:
- **Storage Location**: IndexedDB database scoped to `chat.deepseek.com` origin
- **Physical Location**: Your local computer's Chrome profile directory
- **Access**: Only accessible by you through your browser
- **Syncing**: Data is **NOT** synced across devices
- **Cloud**: Data is **NEVER** uploaded to any cloud service

### How to View Your Data
1. Open Chrome DevTools (F12) on chat.deepseek.com
2. Navigate to: **Application** → **IndexedDB** → **DeepSeekChatDB**
3. View/edit/delete any stored data directly

### How to Delete Your Data
**Option 1: Clear Specific Chats**
- Use browser DevTools to delete specific entries from IndexedDB

**Option 2: Clear All Extension Data**
1. Open Chrome: `chrome://settings/siteData`
2. Search for "chat.deepseek.com"
3. Click "Remove" to clear all IndexedDB data

**Option 3: Uninstall Extension**
- Uninstalling the extension does **NOT** automatically delete stored data
- Follow Option 2 to completely remove all data

## Permissions

### Required Permissions: **NONE**
This extension requires **zero permissions**. We do not request:
- ❌ No `storage` permission
- ❌ No `tabs` permission
- ❌ No `webRequest` permission
- ❌ No `cookies` permission
- ❌ No host permissions beyond the content script match

### Why No Permissions?
- IndexedDB is available by default in content scripts
- No need to access browser APIs
- Minimal attack surface
- Maximum privacy

## Data Collection

### What We DO NOT Collect
- ❌ No analytics or telemetry
- ❌ No usage statistics
- ❌ No error reporting to external servers
- ❌ No user identification
- ❌ No IP addresses
- ❌ No device information
- ❌ No browsing history
- ❌ No personal information

### Network Requests
This extension makes **ZERO network requests**:
- ❌ No API calls to external servers
- ❌ No tracking beacons
- ❌ No CDN requests for libraries
- ❌ No update checks to external servers
- ❌ No crash reporting

All code runs **100% locally** in your browser.

## Third-Party Services

### What We Use
**NONE** - This extension has zero third-party dependencies:
- No analytics services (Google Analytics, etc.)
- No error tracking (Sentry, etc.)
- No external libraries from CDNs
- No advertising networks

### External Links
The extension popup contains:
- Link to GitHub repository (optional, user-initiated)
- Link to support page (optional, user-initiated)

These links only open when **you click them** - no automatic connections.

## Data Sharing

### Who Has Access to Your Data
**Only you.** We have:
- ❌ No access to your data
- ❌ No servers collecting data
- ❌ No third parties involved
- ❌ No data sharing agreements

### Data Transmission
**Never.** Your data:
- ✅ Stays in your browser
- ✅ Never leaves your device
- ✅ Is NOT transmitted anywhere
- ✅ Remains under your full control

## Security

### How We Protect Your Data
1. **Local-Only Storage**: Data never leaves your browser
2. **No Network Access**: Zero external connections
3. **Minimal Code**: Simple, auditable codebase
4. **No Dependencies**: No third-party code that could be compromised
5. **Same-Origin Policy**: Browser enforces isolation

### Browser Security
Your data benefits from Chrome's built-in security:
- IndexedDB is sandboxed per origin
- Content Security Policy enforced
- Same-origin restrictions apply

## Open Source

### Transparency
- **Source Code**: Fully open source on GitHub
- **Auditable**: Anyone can review the code
- **No Obfuscation**: Clear, readable code
- **Community**: Issue tracking and contributions welcome

View the source: [GitHub Repository](https://github.com/ypyf/deepseek-chat-exporter)

## Data Retention

### How Long We Keep Data
**Indefinitely** - until you delete it:
- Data persists across browser sessions
- Data remains after extension updates
- Data stays even if extension is disabled
- **You control deletion** - delete anytime via DevTools or browser settings

### Automatic Deletion
**None** - We do not automatically delete anything:
- No expiration dates
- No automatic cleanup
- No quota limits (beyond browser limits)

## Children's Privacy

This extension does not knowingly collect data from anyone, including children. Since all data is local and private, there are no special considerations for children's data.

## Changes to Privacy Policy

We may update this privacy policy to:
- Reflect changes in the extension
- Comply with legal requirements
- Improve clarity

Changes will be noted in:
- This document's "Last Updated" date
- Extension version number
- GitHub commit history

## Contact

For privacy questions or concerns:
- **GitHub Issues**: [Report an issue](https://github.com/ypyf/deepseek-chat-exporter/issues)
- **Email**: Contact through GitHub profile

## Your Rights

Since all data is stored locally on your device, you have complete control:
- ✅ **Right to Access**: View all data in DevTools
- ✅ **Right to Delete**: Remove data anytime
- ✅ **Right to Export**: Use export functionality
- ✅ **Right to Control**: Enable/disable extension anytime

## Legal Compliance

This extension complies with:
- **GDPR**: No data collection = no GDPR concerns
- **CCPA**: No personal data sold or shared
- **Chrome Web Store Policies**: Minimal permissions, clear purpose

## Summary

**Privacy-First Design:**
- 🔒 All data stored locally in your browser
- 🚫 Zero network requests or external connections
- 🛡️ No permissions required
- 👁️ Fully open source and auditable
- ✅ You own and control all your data

This extension is designed to be **trustless** - you don't need to trust us because we literally cannot access your data.
