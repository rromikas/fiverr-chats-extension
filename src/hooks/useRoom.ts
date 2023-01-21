import { useEffect, useState } from 'react';
import { supabase } from 'libs/supabase';
import { ROOMS_COLLECTION_NAME } from 'constants/index';
import { Room } from 'types';
import { useTabInContent } from './useTabInContent';

export const useRoom = () => {
  const { tab } = useTabInContent();
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    if (tab?.roomId != null) {
      supabase
        .from(ROOMS_COLLECTION_NAME)
        .select('*')
        .eq('room_id', tab.roomId)
        .limit(1)
        .single()
        .then((res) => {
          if (res.data) {
            setRoom(res.data);
          }
        });
    } else {
      setRoom(undefined);
    }
  }, [tab?.roomId]);
  return { room, setRoom };
};
