export type Resource = { type: 'contacts' | 'conversation'; id?: string };

export interface RequestPayload {
  resource: Resource;
}

export interface Message {
  username: string;
  text: string;
}

export interface MessagePayload {
  message: Message;
}

export type ExtensionState = 'On' | 'Off';

export interface TabData {
  allowedToStream: boolean;
  roomId: string | undefined;
  tabId: number;
  chats: {
    [username: string]: {
      time: string;
      conversationHtml: string;
    };
  };
}

export interface LocalStorage {
  [key: string]: TabData;
}

export interface Room {
  name: string;
  id: string;
  room_id: string;
  created_by: string;
  clients: Client[];
}

export interface Client {
  photo?: string;
  color?: string;
  username: string;
}

export interface FullContact {
  time: string;
  username: string;
  element: Element;
}
