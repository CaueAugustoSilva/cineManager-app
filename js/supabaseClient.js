import { createClient }
from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL =
    'https://ekthqlvxuynarnbosxoy.supabase.co'

const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGhxbHZ4dXluYXJuYm9zeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODQzNDIsImV4cCI6MjA5ODA2MDM0Mn0.yGUPL3nG6uOR0rWgngiZcC0Pe9owM7RXcSkksg68VX0'

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    )