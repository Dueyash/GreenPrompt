const DB_NAME = 'DeepSeekChatDB';
const DB_VERSION = 1;
const STORE_CHATS = 'chats';
const STORE_MESSAGES = 'messages';

class ChatDatabase {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[Green Prompt DB] Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[Green Prompt DB] ✅ Database ready');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_CHATS)) {
          const chatStore = db.createObjectStore(STORE_CHATS, { keyPath: 'chatId' });
          chatStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
          chatStore.createIndex('title', 'title', { unique: false });
          console.log('[Green Prompt DB] Created chats store');
        }

        if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
          const messageStore = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id', autoIncrement: true });
          messageStore.createIndex('chatId', 'chatId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
          messageStore.createIndex('chatId_timestamp', ['chatId', 'timestamp'], { unique: false });
          messageStore.createIndex('element_id', 'element_id', { unique: true });
          console.log('[Green Prompt DB] Created messages store');
        }
      };
    });

    return this.initPromise;
  }

  getCurrentChatId() {
    const url = window.location.href;
    const match = url.match(/\/chat\/([a-f0-9-]+)/);
    return match ? match[1] : 'default';
  }

  getChatMetadata() {
    const titleElement = document.querySelector('.f8d1e4c0');
    return {
      chatId: this.getCurrentChatId(),
      title: titleElement ? titleElement.textContent.trim() : 'Untitled Chat',
      url: window.location.href,
      lastUpdated: new Date().toISOString()
    };
  }

  async saveMessage(message) {
    await this.init();
    const chatId = this.getCurrentChatId();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS, STORE_MESSAGES], 'readwrite');
      const chatStore = transaction.objectStore(STORE_CHATS);
      const messageStore = transaction.objectStore(STORE_MESSAGES);

      const checkRequest = messageStore.index('element_id').get(message.element_id);

      checkRequest.onsuccess = () => {
        if (checkRequest.result) {
          resolve(false);
          return;
        }

        const messageData = {
          chatId,
          ...message,
          timestamp: message.timestamp || new Date().toISOString()
        };

        const addMessageRequest = messageStore.add(messageData);

        addMessageRequest.onsuccess = () => {
          const chatMetadata = this.getChatMetadata();
          
          const getChatRequest = chatStore.get(chatId);
          
          getChatRequest.onsuccess = () => {
            const existingChat = getChatRequest.result;
            const messageCount = existingChat ? existingChat.messageCount + 1 : 1;
            
            const chatData = {
              ...chatMetadata,
              messageCount,
              firstMessage: existingChat ? existingChat.firstMessage : new Date().toISOString()
            };

            chatStore.put(chatData);
            resolve(true);
          };

          getChatRequest.onerror = () => reject(getChatRequest.error);
        };

        addMessageRequest.onerror = () => reject(addMessageRequest.error);
      };

      checkRequest.onerror = () => reject(checkRequest.error);
    });
  }

  async getChatData(chatId = null) {
    await this.init();
    if (!chatId) {
      chatId = this.getCurrentChatId();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS, STORE_MESSAGES], 'readonly');
      const chatStore = transaction.objectStore(STORE_CHATS);
      const messageStore = transaction.objectStore(STORE_MESSAGES);

      const chatRequest = chatStore.get(chatId);

      chatRequest.onsuccess = () => {
        const chat = chatRequest.result || {
          chatId,
          title: 'Untitled Chat',
          url: window.location.href,
          messageCount: 0
        };

        const messagesRequest = messageStore.index('chatId').getAll(chatId);

        messagesRequest.onsuccess = () => {
          const messages = messagesRequest.result.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );

          resolve({
            ...chat,
            messages
          });
        };

        messagesRequest.onerror = () => reject(messagesRequest.error);
      };

      chatRequest.onerror = () => reject(chatRequest.error);
    });
  }

  async getAllChats() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS], 'readonly');
      const chatStore = transaction.objectStore(STORE_CHATS);
      const request = chatStore.getAll();

      request.onsuccess = () => {
        const chats = request.result.sort((a, b) => 
          new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        resolve(chats);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearChat(chatId = null) {
    await this.init();
    if (!chatId) {
      chatId = this.getCurrentChatId();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS, STORE_MESSAGES], 'readwrite');
      const chatStore = transaction.objectStore(STORE_CHATS);
      const messageStore = transaction.objectStore(STORE_MESSAGES);

      const messagesRequest = messageStore.index('chatId').getAllKeys(chatId);

      messagesRequest.onsuccess = () => {
        const messageKeys = messagesRequest.result;
        messageKeys.forEach(key => messageStore.delete(key));
        chatStore.delete(chatId);
        
        console.log(`[Green Prompt DB] Cleared chat: ${chatId}`);
        resolve();
      };

      messagesRequest.onerror = () => reject(messagesRequest.error);
    });
  }

  async clearAllChats() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS, STORE_MESSAGES], 'readwrite');
      
      const chatsClear = transaction.objectStore(STORE_CHATS).clear();
      const messagesClear = transaction.objectStore(STORE_MESSAGES).clear();

      transaction.oncomplete = () => {
        console.log('[Green Prompt DB] Cleared all chats');
        resolve();
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getStats() {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_CHATS, STORE_MESSAGES], 'readonly');
      const chatStore = transaction.objectStore(STORE_CHATS);
      const messageStore = transaction.objectStore(STORE_MESSAGES);

      const chatsRequest = chatStore.count();
      const messagesRequest = messageStore.count();

      let totalChats = 0;
      let totalMessages = 0;

      chatsRequest.onsuccess = () => {
        totalChats = chatsRequest.result;
        
        messagesRequest.onsuccess = () => {
          totalMessages = messagesRequest.result;
          resolve({ totalChats, totalMessages });
        };
      };

      chatsRequest.onerror = () => reject(chatsRequest.error);
      messagesRequest.onerror = () => reject(messagesRequest.error);
    });
  }

  async exportDatabase() {
    await this.init();
    const chats = await this.getAllChats();
    const allData = [];

    for (const chat of chats) {
      const chatData = await this.getChatData(chat.chatId);
      allData.push(chatData);
    }

    return {
      version: DB_VERSION,
      exportDate: new Date().toISOString(),
      chats: allData
    };
  }
}

const chatDB = new ChatDatabase();
