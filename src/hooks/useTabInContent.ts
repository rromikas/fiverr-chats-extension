import { getMyTabInContent } from 'helpers/tab';
import { useState, useEffect, useRef } from 'react';
import { TabData } from 'types';
import { onTabs } from 'helpers/storage';

export const useTabInContent = () => {
  const [tab, setTab] = useState<TabData>();
  const tabRef = useRef<TabData>();

  useEffect(() => {
    getMyTabInContent().then((id) => {
      onTabs((tabs) => {
        const data = tabs[id.toString()];
        if (data) {
          tabRef.current = data;
          setTab(data);
        } else {
          chrome.storage.local.set({
            [id.toString()]: {
              chats: {},
              tabId: id,
              allowedToStream: false,
              roomId: undefined,
            } as TabData,
          });
        }
      });
    });
  }, []);

  return { tab, tabRef };
};
