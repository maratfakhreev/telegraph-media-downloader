chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['application.js'],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'supportDeveloper',
    title: 'Buy me a ☕️',
    contexts: ['action'],
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'supportDeveloper') {
    chrome.tabs.create({ url: 'https://buymeacoffee.com/maratfakhreev' });
  }
});
