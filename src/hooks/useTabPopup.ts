import { onTabs } from 'helpers/storage';
import { getMyTabInExtension } from 'helpers/tab';
import { useEffect, useState } from 'react';
import { TabData } from 'types';

export const useTabInPopup = () => {
  const [tab, setTab] = useState<TabData>();
  useEffect(() => {
    getMyTabInExtension().then((t) => {
      onTabs((tabs) => {
        if (t.id) {
          setTab({ ...tabs[t.id.toString()] });
        }
      });
    });
  }, []);

  return tab;
};
