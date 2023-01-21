import { User } from '@supabase/supabase-js';
import { supabase } from 'libs/supabase';
import { useEffect, useState } from 'react';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user);
    });
    supabase.auth.onAuthStateChange(async (ev) => {
      const userRes = await supabase.auth.getUser();
      setUser(userRes.data.user);
    });
  }, []);

  return user;
};
