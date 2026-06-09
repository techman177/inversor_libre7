import { createClient } from '@supabase/supabase-js'

// Traemos las llaves de seguridad que guardaste en el .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Creamos y exportamos la conexión oficial para usarla en toda la plataforma
export const supabase = createClient(supabaseUrl, supabaseKey)