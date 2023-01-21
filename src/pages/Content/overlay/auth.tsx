import React, { FunctionComponent, useState } from 'react';
import Input from 'components/input';
import Button from 'components/button';
import { supabase } from 'libs/supabase';
import Message from './message';
import { APP_URL } from 'constants/index';

interface AuthProps {}

const Auth: FunctionComponent<AuthProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    supabase.auth.signInWithPassword({ email, password });
  };

  return (
    <div className="flex w-full h-full flex-col bg-white p-3 rounded-xl">
      <Message message="Hi, let's login to your account"></Message>
      <div className="h-0 flex-grow mt-4 flex text-sm">
        <div className="my-auto w-full p-4">
          <div className="mb-1">Your Email</div>
          <Input
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <div className="mb-1 mt-4">Your Password</div>
          <Input
            type="password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Button onClick={signIn} className="mt-4" variant="standard">
            Sign In
          </Button>
          <div
            onClick={() => window.open(`${APP_URL}/auth`)}
            className="mt-4 text-center text-black/40 hover:text-primary cursor-pointer"
          >
            Don't have an account? Sign up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
