import React, { FunctionComponent } from 'react';
import { Client } from 'types';

interface AvatarProps {
  client: Client;
  size: number;
}

const Avatar: FunctionComponent<AvatarProps> = ({ size, client }) => {
  return (
    <div
      className="rounded-full bg-center bg-cover flex items-center justify-center"
      style={{
        width: size,
        height: size,
        ...(client.photo
          ? {
              backgroundImage: `url(${client.photo})`,
            }
          : client.color
          ? {
              backgroundColor: client.color,
            }
          : {}),
      }}
    >
      <div className="z-10 text-white font-medium">
        {client.photo ? null : client.username.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
