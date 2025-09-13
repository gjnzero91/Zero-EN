// Zero-EN/js/modules/core/supabaseConfig.js
// Cấu hình Supabase cho ứng dụng Zero-EN


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://gdviovufcfxuckktocgj.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdmlvdnVmY2Z4dWNra3RvY2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk4NTMsImV4cCI6MjA3MDgyNTg1M30.PpBpou_3zbx7DCtJ5SYoDCRt0SQn_QzFQawGSUFKfe4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
