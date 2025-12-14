
chrome.runtime.onInstalled.addListener((details) => {
  console.log('CVD Color Assistant 已安装', details);
  

  chrome.storage.sync.get(['cvdType', 'severity', 'enabled'], (result) => {
    if (!result.cvdType) {
      chrome.storage.sync.set({
        enabled: false,
        cvdType: 'deuteranomaly',
        severity: 0.8,
        autoRecolor: false,
        rememberSettings: true
      });
    }
  });


  chrome.contextMenus.create({
    id: 'cvd-analyze-element',
    title: '分析此元素的颜色',
    contexts: ['all']
  });

  chrome.contextMenus.create({
    id: 'cvd-simulate-protanomaly',
    title: '🔴 模拟红色弱视角',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'cvd-simulate-deuteranomaly',
    title: '🟢 模拟绿色弱视角',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'cvd-simulate-tritanomaly',
    title: '🔵 模拟蓝黄弱视角',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'cvd-recolor',
    title: '🎭 智能重新着色',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'cvd-restore',
    title: '↩️ 恢复原始颜色',
    contexts: ['page']
  });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.storage.sync.get(['enabled', 'autoRecolor'], (result) => {
      if (result.enabled && result.autoRecolor) {
        chrome.tabs.sendMessage(tabId, { type: 'AUTO_RECOLOR' }).catch(() => {});
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get(null, (result) => {
        sendResponse({ success: true, settings: result });
      });
      return true;

    case 'SAVE_SETTINGS':
      chrome.storage.sync.set(message.data, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'LOG':
      console.log('[CVD Assistant]', message.data);
      sendResponse({ success: true });
      break;

    default:
      break;
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  switch (info.menuItemId) {
    case 'cvd-analyze-element':
      chrome.tabs.sendMessage(tab.id, {
        type: 'ENABLE_INSPECTOR'
      }).catch(() => {});
      break;

    case 'cvd-simulate-protanomaly':
      chrome.tabs.sendMessage(tab.id, {
        type: 'SET_CVD_TYPE',
        data: { cvdType: 'protanomaly' }
      }).catch(() => {});
      chrome.tabs.sendMessage(tab.id, { type: 'APPLY_SIMULATION' }).catch(() => {});
      break;

    case 'cvd-simulate-deuteranomaly':
      chrome.tabs.sendMessage(tab.id, {
        type: 'SET_CVD_TYPE',
        data: { cvdType: 'deuteranomaly' }
      }).catch(() => {});
      chrome.tabs.sendMessage(tab.id, { type: 'APPLY_SIMULATION' }).catch(() => {});
      break;

    case 'cvd-simulate-tritanomaly':
      chrome.tabs.sendMessage(tab.id, {
        type: 'SET_CVD_TYPE',
        data: { cvdType: 'tritanomaly' }
      }).catch(() => {});
      chrome.tabs.sendMessage(tab.id, { type: 'APPLY_SIMULATION' }).catch(() => {});
      break;

    case 'cvd-recolor':
      chrome.tabs.sendMessage(tab.id, { type: 'RECOLOR_PAGE' }).catch(() => {});
      break;

    case 'cvd-restore':
      chrome.tabs.sendMessage(tab.id, { type: 'RESTORE_PAGE' }).catch(() => {});
      chrome.tabs.sendMessage(tab.id, { type: 'REMOVE_SIMULATION' }).catch(() => {});
      break;
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('设置已更新:', changes);
  }
});

console.log('CVD Color Assistant Service Worker 已启动');
