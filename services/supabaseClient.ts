import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount } from '../types';

// Hardcoded credentials to ensure connection works immediately
const SUPABASE_URL = "https://ofeefzeruufyooggaule.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZWVmemVydXVmeW9vZ2dhdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NDAsImV4cCI6MjA4MDYxNjU0MH0.-pdG7Ji5eSFEnzGpqpmcv_oTlQEz6EceUBtO2QHdfao";

console.log("[System] Initializing Supabase Client...");

let client: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_KEY) {
      client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false, // CRITICAL: Disable localStorage to prevent black screen errors
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
  } else {
      console.error("[System] Missing Supabase Credentials");
  }
} catch (error) {
  console.error("[System] CRITICAL: Supabase client failed to initialize:", error);
}

export const supabase = client;

// Helper to check connection status safely
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    console.error("[System] Supabase client is null.");
    return false;
  }
  try {
    // Simple query to verify connectivity
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
        console.warn("[System] Supabase Connectivity Check warning:", error.message);
        // If it's a permission error (PGRST301) or no rows (PGRST116), the connection is technically alive
        if (error.code === 'PGRST116' || error.code === '42P01') return true;
    }
    console.log("[System] Supabase Connected Successfully");
    return true;
  } catch (e) {
    console.error("[System] Supabase Connection Failed:", e);
    return false;
  }
};

/**
 * Verify a user's access key against the database.
 */
export const verifyUserKey = async (keyInput: string): Promise<UserAccount | null> => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('key', keyInput)
            .single();

        if (error || !data) {
            console.log("Key verification failed:", error?.message || "User not found");
            return null;
        }

        return {
            id: data.id,
            username: data.username,
            key: data.key,
            aiName: data.ai_name || data.aiName || 'CentralGPT',
            devName: data.dev_name || data.devName || 'XdpzQ',
            createdAt: data.created_at || data.createdAt
        };
    } catch (err) {
        console.error("Error verifying key:", err);
        return null;
    }
};

/**
 * Fetch all users for Admin Panel
 */
export const fetchUsers = async (): Promise<UserAccount[]> => {
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data.map((u: any) => ({
        id: u.id,
        username: u.username,
        key: u.key,
        aiName: u.ai_name || u.aiName,
        devName: u.dev_name || u.devName,
        createdAt: u.created_at || u.createdAt
    }));
};

/**
 * Create a new user in DB
 */
export const createUser = async (user: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount | null> => {
    if (!supabase) return null;

    const payload = {
        username: user.username,
        key: user.key,
        ai_name: user.aiName,
        dev_name: user.devName,
    };

    const { data, error } = await supabase.from('users').insert([payload]).select().single();

    if (error) {
        console.error("Error creating user:", error);
        return null;
    }

    return {
        id: data.id,
        username: data.username,
        key: data.key,
        aiName: data.ai_name || data.aiName,
        devName: data.dev_name || data.devName,
        createdAt: data.created_at
    };
};

/**
 * Delete a user
 */
export const removeUser = async (id: string): Promise<boolean> => {
    if (!supabase) return false;

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
        console.error("Error deleting user:", error);
        return false;
    }
    return true;
};