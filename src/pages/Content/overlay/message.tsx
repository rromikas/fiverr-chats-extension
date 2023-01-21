import React, { FunctionComponent } from 'react';

interface MessageProps {
  message: string;
}

const Message: FunctionComponent<MessageProps> = ({ message }) => {
  return (
    <div className="flex">
      <img
        className="mr-4"
        style={{ width: 65 }}
        src="https://firebasestorage.googleapis.com/v0/b/fireck-4c36e.appspot.com/o/tNYicFEBetrfEio5D3nLAR.svg?alt=media&token=bb18b97b-29c9-4b84-a211-220d85bc4cf8"
      ></img>
      <div className="flex-grow w-0 rounded-xl bg-gray px-4 py-3 text-base font-medium">
        {message}
      </div>
    </div>
  );
};

export default Message;
