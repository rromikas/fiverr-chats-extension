import React, { FunctionComponent, useRef } from 'react';
import 'assets/styles/tailwind.css';
import RoomFrame from './room';
import Auth from './auth';
import Rooms from './rooms';
import { useUser } from 'hooks/useUser';
import { useRoom } from 'hooks/useRoom';
import { TabData } from 'types';
import { ContentContext } from '../content-context';
import { useScript } from '../useScript';
import { useTabInContent } from 'hooks/useTabInContent';

interface OverlayProps {}

const Overlay: FunctionComponent<OverlayProps> = () => {
  const size = {
    width: 300,
    height: 340,
  };

  const user = useUser();
  const { room, setRoom } = useRoom();
  const { tab, tabRef } = useTabInContent();
  const updateTabData = (updates: Partial<TabData>) => {
    if (!tab) return;
    chrome.storage.local.set({
      [tab.tabId.toString()]: { ...tabRef.current, ...updates },
    });
  };
  useScript({ tabData: tab, room, updateTabData });

  const frame = user ? (room ? 2 : 1) : 0;

  return !tab?.allowedToStream ? null : (
    <ContentContext.Provider
      value={{ tabData: tab, updateTabData, room, setRoom }}
    >
      <div className="fixed left-0 top-0 w-full h-full bg-black/20 flex justify-end p-7 z-[10000] font-[poppins]">
        <div style={size} className="relative overflow-hidden">
          <div
            className="flex transition"
            style={{ transform: `translateX(${-frame * size.width}px)` }}
          >
            <div className="flex-shrink-0" style={size}>
              <Auth></Auth>
            </div>
            <div className="flex-shrink-0" style={size}>
              <Rooms></Rooms>
            </div>
            <div className="flex-shrink-0" style={size}>
              <RoomFrame></RoomFrame>
            </div>
          </div>
        </div>
      </div>
    </ContentContext.Provider>
  );
};

export default Overlay;
