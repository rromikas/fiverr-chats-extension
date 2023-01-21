import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ijlvsghpalttxmfirbqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbHZzZ2hwYWx0dHhtZmlyYnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTYzMjMyMDUsImV4cCI6MTk3MTg5OTIwNX0.VVqnKFnoBxdEy_NOLSbzSy69yrn-Uhz9ZIgihAzBlF0',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
