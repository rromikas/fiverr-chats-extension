export const getMyTabInExtension = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
};

export const getMyTabInContent = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'get-tab-id' }, (response) => {
      resolve(response);
    });
  });
};
