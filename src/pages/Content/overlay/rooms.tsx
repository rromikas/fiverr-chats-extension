import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from 'libs/supabase';
import { ROOMS_COLLECTION_NAME } from 'constants/index';
import { Room, TabData } from 'types';
import Button from 'components/button';
import Message from './message';
import Input from 'components/input';
import { ContentContext } from '../content-context';

interface RoomsProps {}

const Rooms: FunctionComponent<RoomsProps> = () => {
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const { tabData, updateTabData } = useContext(ContentContext);

  useEffect(() => {
    supabase
      .from(ROOMS_COLLECTION_NAME)
      .select('*')
      .then(({ data }) => {
        if (data) {
          setRooms(data);
        }
      });
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl p-3">
      <Message message="Time to select a room"></Message>
      <div className="py-1 mt-4">
        <Input
          className="w-full"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></Input>
      </div>
      <div className="h-0 flex-grow overflow-auto -mx-3 -mb-3 p-3">
        {rooms
          .filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
          .map((x, i) => (
            <Button
              className="mb-2 font-medium"
              key={`room-${i}`}
              onClick={() => {
                if (!tabData) return;
                updateTabData({ roomId: x.room_id });
              }}
              variant="secondary"
            >
              {x.name}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Rooms;
