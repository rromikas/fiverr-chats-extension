import { useRoom } from 'hooks/useRoom';
import { createContext } from 'react';
import { TabData } from 'types';

export interface ContentContextType extends ReturnType<typeof useRoom> {
  tabData: TabData | undefined;
  updateTabData: (val: Partial<TabData>) => void;
}

export const ContentContext = createContext<ContentContextType>({} as any);
