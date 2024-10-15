const downloadSequentially = (urls: string[], tabId: number): void => {
  const urlsLength = urls.length;
  let index = 0;
  let currentId;

  const onChanged = ({ id, state }): void => {
    if (id === currentId && state && state.current !== 'in_progress') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      next();
    }
  };

  const next = (): void => {
    if (index >= urlsLength) {
      chrome.downloads.onChanged.removeListener(onChanged);

      return;
    }

    ++index;
    chrome.tabs.sendMessage(tabId, {
      msg: 'render_counter',
      data: { index, count: urlsLength },
    });

    if (urls[index]) {
      chrome.downloads.download({ url: urls[index] }, id => {
        currentId = id;
      });
    }
  };

  chrome.downloads.onChanged.addListener(onChanged);
  next();
};

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

chrome.runtime.onMessage.addListener(
  async (
    { msg, urls }: { msg: string; urls: string[] },
    { tab: { id: tabId } },
    sendResponse: () => void
  ) => {
    switch (msg) {
      case 'download': {
        try {
          downloadSequentially(urls, tabId);
        } catch (e) {
          throw new Error(e);
        }

        break;
      }
    }

    sendResponse();
  }
);
