
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount, AppConfig, ChatHistoryItem } from '../types';

// Hardcoded credentials
const SUPABASE_URL = "https://ofeefzeruufyooggaule.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZWVmemVydXVmeW9vZ2dhdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NDAsImV4cCI6MjA4MDYxNjU0MH0.-pdG7Ji5eSFEnzGpqpmcv_oTlQEz6EceUBtO2QHdfao";

let client: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_KEY) {
      client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: false, // We handle session manually
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
  }
} catch (error) {
  console.error("[System] Supabase init failed:", error);
}

export const supabase = client;

// --- SESSION MANAGEMENT (LOCAL STORAGE) ---
const SESSION_KEY = 'CENTRAL_GPT_SESSION_V2';

export const saveSession = (user: UserAccount) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save session", e);
  }
};

export const getSession = (): UserAccount | null => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// --- APP CONFIGURATION (SUPABASE DB) ---

export const fetchAppConfig = async (): Promise<Partial<AppConfig> | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
        // If table is empty or doesn't exist yet, return null
        console.warn("Config fetch warning:", error.message);
        return null;
    }
    
    if (!data) return null;

    return {
      maintenanceMode: data.maintenance_mode,
      featureVoice: data.feature_voice,
      featureImage: data.feature_image,
      geminiKeys: data.gemini_keys || [] // Ensure array
    };
  } catch (e) {
    console.error("Error fetching app config:", e);
    return null;
  }
};

export const updateAppConfig = async (config: Partial<AppConfig>) => {
  if (!supabase) return false;
  try {
    const dbPayload: any = {};
    if (config.maintenanceMode !== undefined) dbPayload.maintenance_mode = config.maintenanceMode;
    if (config.featureVoice !== undefined) dbPayload.feature_voice = config.featureVoice;
    if (config.featureImage !== undefined) dbPayload.feature_image = config.featureImage;
    if (config.geminiKeys !== undefined) dbPayload.gemini_keys = config.geminiKeys;

    // Check if row exists
    const { data: current } = await supabase.from('app_config').select('id').limit(1).single();
    
    if (current) {
        const { error } = await supabase
        .from('app_config')
        .update(dbPayload)
        .eq('id', current.id);
        
        if (error) throw error;
        return true;
    } else {
        // Insert default row if missing
        const { error } = await supabase.from('app_config').insert([dbPayload]);
        if (error) throw error;
        return true;
    }
  } catch (e) {
    console.error("Error updating config:", e);
    return false;
  }
};

// --- USER MANAGEMENT ---

export const checkSupabaseConnection = async () => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') return false; 
    return true;
  } catch (e) {
    return false;
  }
};

export const verifyUserKey = async (keyInput: string): Promise<UserAccount | null> => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('key', keyInput)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            username: data.username,
            key: data.key,
            aiName: data.ai_name || 'CentralGPT',
            devName: data.dev_name || 'XdpzQ',
            createdAt: data.created_at
        };
    } catch (err) {
        return null;
    }
};

export const fetchUsers = async (): Promise<UserAccount[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((u: any) => ({
        id: u.id,
        username: u.username,
        key: u.key,
        aiName: u.ai_name,
        devName: u.dev_name,
        createdAt: u.created_at
    }));
};

export const createUser = async (user: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount | null> => {
    if (!supabase) return null;
    const payload = {
        username: user.username,
        key: user.key,
        ai_name: user.aiName,
        dev_name: user.devName,
    };
    const { data, error } = await supabase.from('users').insert([payload]).select().single();
    if (error) return null;
    return {
        id: data.id,
        username: data.username,
        key: data.key,
        aiName: data.ai_name,
        devName: data.dev_name,
        createdAt: data.created_at
    };
};

export const removeUser = async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.from('users').delete().eq('id', id);
    return !error;
};

// --- CHAT PERSISTENCE ---

export const fetchChatHistory = async (username: string): Promise<ChatHistoryItem[]> => {
  if (!supabase) return [];
  // Fetch last 50 messages for this user
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('username', username)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error || !data) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    username: item.username,
    aiName: item.ai_name,
    userMessage: item.user_message,
    aiResponse: item.ai_response,
    image: item.image_data, // Ensure this maps correctly if added to schema
    timestamp: item.timestamp
  }));
};

export const saveChatLog = async (
  username: string, 
  aiName: string, 
  userMsg: string, 
  aiResp: string, 
  image?: string
): Promise<boolean> => {
  if (!supabase) return false;
  
  const payload = {
    username: username,
    ai_name: aiName,
    user_message: userMsg,
    ai_response: aiResp,
    image_data: image || null,
    timestamp: new Date().toLocaleTimeString()
  };

  const { error } = await supabase.from('chat_history').insert([payload]);
  if (error) {
    console.error("Failed to save chat log:", error);
    return false;
  }
  return true;
};
