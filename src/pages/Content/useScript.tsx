import { RealtimeChannel } from '@supabase/supabase-js';
import {
  FullContact,
  Message,
  MessagePayload,
  RequestPayload,
  Room,
  TabData,
} from 'types';
import { awaitable } from 'helpers/promise';
import { awaitElement } from 'helpers/awaitElement';
import { supabase } from 'libs/supabase';
import { useEffect, useRef } from 'react';
import { sleep } from 'helpers/sleep';
import { SequentialTaskQueue } from 'sequential-task-queue';

interface UseScriptProps {
  tabData: TabData | undefined;
  updateTabData: (val: Partial<TabData>) => void;
  room: Room | undefined;
}

export const useScript = ({ tabData, updateTabData, room }: UseScriptProps) => {
  const taskQueue = useRef(new SequentialTaskQueue());
  const channel = useRef<RealtimeChannel>(supabase.channel('empty'));

  const getContacts = (): FullContact[] => {
    const contacts = document.querySelectorAll('.contacts-list .contact');
    const fullConctacts: FullContact[] = [];
    for (var element of contacts) {
      const username = getContactUsername(element);
      const time = getContactTime(element);
      fullConctacts.push({
        username,
        time,
        element,
      });
    }
    return fullConctacts;
  };

  const clickOnContact = (username: string) => {
    const contacts = document.querySelectorAll('.contacts-list .contact');
    for (var contact of contacts) {
      const nick = getContactUsername(contact);
      if (nick === username) {
        (contact as HTMLElement).click();
      }
    }
  };

  const getConversationUsername = () => {
    return (
      document
        .querySelector('#conversation header .username')
        ?.innerHTML.trim() ?? ''
    );
  };

  const getContactUsername = (el: Element) => {
    return (
      el.querySelector('.username-container strong')?.innerHTML.trim() ?? ''
    );
  };

  const getContactTime = (el: Element) => {
    return (
      (el.querySelector('aside time') as HTMLElement).getAttribute(
        'datetime'
      ) ?? ''
    );
  };

  //scan one chat
  const scanChat = async (contact: FullContact) => {
    (contact.element as HTMLElement).click();
    await sleep(2000);
    const conversationHtml =
      document.querySelector('#conversation')?.outerHTML ?? '';
    return { conversationHtml, time: contact.time };
  };

  //updates chats data on dom changes
  const updateChats = async () => {
    if (!tabData) return;
    const contacts = getContacts();
    const chats = { ...tabData.chats };
    for (var c of contacts) {
      if (room?.clients.map((x) => x.username).includes(c.username)) {
        if (chats[c.username]) {
          if (chats[c.username].time !== c.time) {
            (c.element as HTMLElement).click();
            await sleep(1000);
            const conversationHtml =
              document.querySelector('#conversation')?.outerHTML ?? '';
            chats[c.username] = { time: c.time, conversationHtml };
          }
        } else {
          chats[c.username] = await scanChat(c);
        }
      }
    }
    updateTabData({ chats });
  };

  const getResource = async (resource: RequestPayload['resource']) => {
    if (resource.type === 'contacts') {
      const contacts = getContacts();
      return contacts
        .filter((x) =>
          room?.clients.map((x) => x.username).includes(x.username)
        )
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .map((x) => x.element.outerHTML);
    }

    if (resource.type === 'conversation' && resource.id != null) {
      return tabData?.chats[resource.id].conversationHtml;
    }
  };

  const writeMessage = async (message: Message) => {
    await clickOnContact(message.username);
    await sleep(1000);
    const textarea = document.querySelector(
      '#conversation textarea'
    ) as HTMLTextAreaElement;
    textarea.setAttribute('value', message.text);
    textarea.value = message.text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    const sendButton = document.querySelector(
      '#conversation .message-action'
    ) as HTMLElement;
    await awaitable((resolve) => {
      setTimeout(() => {
        if (getConversationUsername() === message.username) {
          sendButton.click();
        }
        resolve(null);
      }, 500);
    });
  };

  const createChannel = (rid: string) => {
    channel.current = supabase.channel(rid);
    channel.current.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.current.on(
          'broadcast',
          { event: 'request' },
          async (payload) => {
            const request = payload as unknown as RequestPayload;
            const data = await taskQueue.current.push(() =>
              getResource(request.resource)
            );
            channel.current.send({
              ...request,
              type: 'broadcast',
              event: 'response',
              data,
            });
          }
        );
        channel.current.on(
          'broadcast',
          { event: 'message' },
          async (payload) => {
            const request = payload as unknown as MessagePayload;
            taskQueue.current.push(() => writeMessage(request.message));
          }
        );
      }
    });
  };

  useEffect(() => {
    channel.current.unsubscribe();
    console.log('close channel');
    if (tabData?.roomId != null && tabData.allowedToStream) {
      console.log('cretae channel');
      createChannel(tabData.roomId);
    }
  }, [tabData, room]);

  useEffect(() => {
    if (tabData?.allowedToStream) {
      const task = taskQueue.current.push(() => updateChats());
      return () => task.cancel();
    }
  }, [room, tabData]);

  useEffect(() => {
    //listen for chat dom changes
    let destroy = () => {};
    let task = taskQueue.current.push(() => updateChats());
    awaitElement('.contacts-list').then((el) => {
      const mo = new MutationObserver(async () => {
        task?.cancel();
        task = taskQueue.current.push(() => updateChats());
      });

      mo.observe(el, { subtree: true, childList: true });
      destroy = () => mo.disconnect();
    });

    return () => {
      destroy();
    };
  }, [tabData]);

  useEffect(() => {
    const handle = (e: any) => {
      e = e || window.event;
      if (tabData?.roomId != null) {
        const message = 'This tab is streaming your inbox. You are sure?';
        // For IE and Firefox prior to version 4
        if (e) {
          e.returnValue = message;
        }

        // For Safari
        return message;
      }
    };
    window.addEventListener('beforeunload', handle);

    return () => window.removeEventListener('beforeunload', handle);
  }, [tabData]);

  useEffect(() => {
    if (tabData?.allowedToStream) {
      //refresh tab every 2 minutes
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 120000);

      return () => clearTimeout(timeout);
    }
  }, [tabData?.allowedToStream]);
};
