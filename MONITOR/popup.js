document.addEventListener('DOMContentLoaded', function() {
  loadStorageStats();
  setupExportButtons();
});

async function loadStorageStats() {
  const totalChatsElem = document.getElementById('total-chats');
  const totalMessagesElem = document.getElementById('total-messages');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || !tab.url.includes('chat.deepseek.com')) {
      totalChatsElem.textContent = '—';
      totalMessagesElem.textContent = '—';
      showStatus('📍 Please visit chat.deepseek.com to see stats and export', 'error');
      
      document.querySelectorAll('.export-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      });
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStats' });
    
    if (response && !response.error) {
      totalChatsElem.textContent = response.totalChats || 0;
      totalMessagesElem.textContent = response.totalMessages || 0;
      
      if (response.totalChats === 0 && response.totalMessages === 0) {
        showStatus('💬 Start chatting to see statistics', 'success');
      }
    } else {
      totalChatsElem.textContent = '0';
      totalMessagesElem.textContent = '0';
      showStatus('⚠️ Extension loaded. Start chatting to capture messages.', 'error');
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    totalChatsElem.textContent = '—';
    totalMessagesElem.textContent = '—';
    showStatus('📍 Open chat.deepseek.com in this tab', 'error');
    
    document.querySelectorAll('.export-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    });
  }
}

function setupExportButtons() {
  const exportButtons = document.querySelectorAll('.export-btn');
  
  exportButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const format = button.getAttribute('data-format');
      await handleExport(format);
    });
  });
}

async function handleExport(format) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || !tab.url.includes('chat.deepseek.com')) {
      showStatus('Please open a DeepSeek chat page to export', 'error');
      return;
    }

    showStatus(`Exporting as ${format.toUpperCase()}...`, 'success');

    await chrome.tabs.sendMessage(tab.id, { 
      action: 'exportChat', 
      format: format 
    });

    setTimeout(() => {
      showStatus(`Export completed as ${format.toUpperCase()}!`, 'success');
      setTimeout(() => hideStatus(), 2000);
    }, 500);

  } catch (error) {
    console.error('Export error:', error);
    showStatus('Export failed. Please try again.', 'error');
    setTimeout(() => hideStatus(), 3000);
  }
}

function showStatus(message, type) {
  const statusElem = document.getElementById('status-message');
  statusElem.textContent = message;
  statusElem.className = `status-message show ${type}`;
}

function hideStatus() {
  const statusElem = document.getElementById('status-message');
  statusElem.className = 'status-message';
}
