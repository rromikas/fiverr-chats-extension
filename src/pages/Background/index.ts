import { getMyTabInExtension } from 'helpers/tab';
import { TabData } from 'types';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action == 'get-tab-id') {
    sendResponse(sender?.tab?.id);
  }
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  chrome.storage.local.remove(tabid.toString());
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.storage.local.get().then((tabs) => {
    const tabData = tabs[tab.id?.toString() ?? ''] as TabData | undefined;
    if (!tabData) return;
    if (tab?.url?.includes('fiverr.com/inbox')) {
      chrome.storage.local.set({
        [tabData.tabId.toString()]: {
          ...tabData,
          allowedToStream: !tabData.allowedToStream,
        } as TabData,
      });
    }
  });
});
