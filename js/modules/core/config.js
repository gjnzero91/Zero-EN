// js/modules/core/config.js
// Cấu hình Supabase và các thiết lập ứng dụng

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase credentials
export const SUPABASE_URL = "https://gdviovufcfxuckktocgj.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdmlvdnVmY2Z4dWNra3RvY2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk4NTMsImV4cCI6MjA3MDgyNTg1M30.PpBpou_3zbx7DCtJ5SYoDCRt0SQn_QzFQawGSUFKfe4";

// Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// App config
export const config = {
  appName: "Vocab Trainer",
  dataset: {
    a1b1: "data/3000.json",
    b2c2: "data/5000.json",
    custom: "data/custom.json"
  },
  defaultPackageSize: 10,
  autoNextSeconds: 5,
  autoPronounceSeconds: 5,
  longPressMs: 80
};
