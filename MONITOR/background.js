/**
 * DeepSeek Chat Exporter - Background Script
 *
 * This script runs in the background and handles extension-level functionality.
 */

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Green Prompt] 🌱 Installed - Privacy-first, local-only storage');
    console.log('[Green Prompt] 🔒 All data stored locally in IndexedDB');
    console.log('[Green Prompt] 🚫 Zero external network requests');
  } else if (details.reason === 'update') {
    console.log('[Green Prompt] ✨ Updated to version 2.0.0');
    console.log('[Green Prompt] 📊 Using IndexedDB for better performance');
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ping') {
    sendResponse({ status: 'alive' });
  }
  return true;
});
