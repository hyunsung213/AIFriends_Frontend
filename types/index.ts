export type VoiceStatus = 'idle' | 'listening' | 'stt_processing' | 'processing' | 'speaking' | 'summary' | 'error';

export interface User {
  id: string;
  email: string;
  name: string;
  birthYear?: number;
  preferredCall?: string;
  speechStyle?: string;
  memorySaveConsent?: boolean;
  reportConsent?: boolean;
  guardianShareConsent?: boolean;
  saveRawMessages?: boolean;
  likes?: string;
  familyNotes?: string;
  importantNotes?: string;
}

export interface Mood {
  id: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  riskLevel?: 'low' | 'high' | 'critical' | string;
}

export interface SummaryResult {
  todayMind: string;
  topics: string[];
  suggestedAction: string;
}

export interface MemoryItem {
  id?: string;
  content: string;
  type: 'core' | 'semantic' | 'procedural' | 'episodic';
  importance?: number;
  createdAt?: string;
  selected?: boolean; // UI only state
}

export interface WeeklyReport {
  reportId?: string;
  period?: { start: string; end: string };
  summary?: string;
  emotions?: { name: string; percentage: number }[];
  frequentTopics?: string[];
  positiveSignals?: string[];
  suggestions?: string[];
  
  // 부족할 때
  message?: string;
  requiredConversations?: number;
  currentConversations?: number;
}
