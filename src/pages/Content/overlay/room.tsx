import React, { FunctionComponent, useContext, useState } from 'react';
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { Client } from 'types';
import Message from './message';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Input from 'components/input';
import { supabase } from 'libs/supabase';
import { APP_URL, ROOMS_COLLECTION_NAME } from 'constants/index';
import Avatar from 'components/avatar';
import { ContentContext } from '../content-context';

interface RoomFrameProps {}

const RoomFrame: FunctionComponent<RoomFrameProps> = ({}) => {
  const [select, setSelect] = useState(false);
  const [search, setSearch] = useState('');
  const { tabData, updateTabData, setRoom, room } = useContext(ContentContext);
  const includedClients = room?.clients.map((x) => x.username) ?? [];

  return (
    <div className="w-full h-full flex flex-col relative bg-white rounded-xl p-3 overflow-hidden">
      <Message message="Add clients to your room"></Message>
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <div className="text-[20px] font-semibold mr-3 leading-none">
            {room?.name}
          </div>
          <ArrowTopRightOnSquareIcon
            width={24}
            height={24}
            strokeWidth={2}
            onClick={() => window.open(APP_URL + `/` + room?.room_id)}
            className="cursor-pointer"
          ></ArrowTopRightOnSquareIcon>
        </div>
        <div
          onClick={() => {
            if (tabData != null) {
              updateTabData({ roomId: undefined });
            }
          }}
          className="w-[27px] h-[27px] rounded-md flex right-1 bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30"
        >
          <XMarkIcon className="m-auto"></XMarkIcon>
        </div>
      </div>
      <div className="h-0 flex-grow overflow-auto flex content-start flex-wrap p-2 -mx-3 -mb-3">
        {room?.clients.map((x, i) => (
          <div key={`client-${i}`} className="p-1 w-1/4">
            <div className="bg-gray rounded-xl p-2 relative group overflow-hidden">
              <div className="flex justify-center mb-3">
                <Avatar size={37} client={x}></Avatar>
              </div>
              <div className="text-center font-medium text-xs truncate">
                {x.username}
              </div>
              <div
                onClick={() => {
                  if (!room) return;
                  let clients = [...room.clients];
                  clients.splice(i, 1);
                  supabase
                    .from(ROOMS_COLLECTION_NAME)
                    .update({ clients })
                    .eq('id', room.id)
                    .then(() => {});
                  setRoom({ ...room, clients });
                }}
                className="bg-black/20 opacity-0 group-hover:opacity-100 absolute left-0 top-0 w-full h-full flex transition cursor-pointer pointer-events-none group-hover:pointer-events-auto"
              >
                <XMarkIcon
                  className="m-auto text-white"
                  width={30}
                  height={30}
                  strokeWidth={2}
                ></XMarkIcon>
              </div>
            </div>
          </div>
        ))}
        <div className="w-1/4 p-1">
          <div
            onClick={() => setSelect(true)}
            className="bg-gray hover:bg-[#EDEDED] rounded-xl min-h-[70px] flex items-center justify-center h-full cursor-pointer"
          >
            <UserPlusIcon width={35} strokeWidth={2}></UserPlusIcon>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          'absolute left-0 top-0 w-full h-full z-10 flex transition',
          {
            'pointer-events-none bg-black/0': !select,
            'bg-black/30': select,
          }
        )}
      >
        <div
          className={classNames('bg-white transform transition flex flex-col', {
            '-translate-x-full': !select,
            'translate-x-0': select,
          })}
        >
          <div className="p-1 bg-white">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
          </div>
          <div className="flex-grow h-0 overflow-auto">
            {[...document.querySelectorAll('.contacts-list .contact')]
              .map((x, i) => {
                const photo = (
                  x.querySelector(
                    '.image-container img'
                  ) as HTMLImageElement | null
                )?.src;
                const color = (
                  x.querySelector(
                    '.image-container figure'
                  ) as HTMLElement | null
                )?.style.backgroundColor;
                const username = (
                  x.querySelector('.username-container strong') as HTMLElement
                ).innerHTML.trim();
                const client: Client = { photo, color, username };
                return client;
              })
              .filter(
                (x) =>
                  !includedClients.includes(x.username) &&
                  x.username.toLowerCase().includes(search.toLowerCase())
              )
              .map((client) => {
                return (
                  <div
                    onClick={() => {
                      if (!room) return;
                      let clients = [...room.clients];
                      clients.push(client);
                      supabase
                        .from(ROOMS_COLLECTION_NAME)
                        .update({ clients })
                        .eq('id', room.id)
                        .then(() => {});
                      setRoom({ ...room, clients });
                      setSelect(false);
                    }}
                    className="flex items-center py-1 px-3 hover:bg-gray cursor-pointer"
                  >
                    <Avatar size={28} client={client}></Avatar>
                    <div className="text-xs font-medium ml-2">
                      {client.username}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div onClick={() => setSelect(false)} className="w-0 flex-grow"></div>
      </div>
    </div>
  );
};

export default RoomFrame;
