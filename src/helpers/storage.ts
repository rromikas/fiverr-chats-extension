import { LocalStorage } from 'types';
import copy from 'fast-copy';

export const getLocalStorage = (): Promise<LocalStorage> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get().then((data) => {
      resolve(data as LocalStorage);
    });
  });
};

export const onTabs = async (fn: (val: LocalStorage) => void) => {
  let tabs = await chrome.storage.local.get();
  fn(copy(tabs));
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      for (let [key, { newValue }] of Object.entries(changes)) {
        tabs[key] = newValue;
        fn(copy(tabs));
      }
    }
  });
};

export const subscribeLocalStorage = async (
  onKeyValue: (key: string, newValue: any, oldValue?: any) => void
) => {
  const data = await getLocalStorage();
  Object.keys(data).forEach((x) => {
    onKeyValue(x, data[x], data[x]);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      for (let [key, { newValue, oldValue }] of Object.entries(changes)) {
        onKeyValue(key, newValue, oldValue);
      }
    }
  });
};
