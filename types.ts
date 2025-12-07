
export enum Screen {
  BOOT = 'BOOT',
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  TERMINAL = 'TERMINAL',
  ADMIN = 'ADMIN',
  TESTIMONIALS = 'TESTIMONIALS',
  ABOUT = 'ABOUT',
  HISTORY = 'HISTORY'
}

export interface UserAccount {
  id: string;
  username: string;
  key: string;
  aiName: string;
  devName: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  text: string;
  imageData?: string; // Base64 string from file upload
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  image?: string;
  timestamp: number;
}

export interface ChatHistoryItem {
  id: string;
  username: string;
  aiName: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

export interface AppConfig {
  maintenanceMode: boolean;
  featureVoice: boolean;
  featureImage: boolean;
  geminiKeys: string[]; // Changed to array for multiple keys
  deepseekKey: string; 
}
