import { create } from 'zustand';
import { Mood, ChatMessage, SummaryResult, MemoryItem } from '@/types';
import { chatApi } from '@/lib/api/chat';

interface ChatState {
  currentMood: Mood | null;
  setMood: (mood: Mood) => void;
  
  conversationId: string | null;
  startConversation: (moodId: string) => Promise<void>;

  messages: ChatMessage[];
  addLocalMessage: (msg: ChatMessage) => void;
  sendMessage: (text: string) => Promise<string | void>;
  sendAudio: (audioBlob: Blob, durationMs: number) => Promise<string | void>;
  clearMessages: () => void;

  summary: SummaryResult | null;
  memories: MemoryItem[];
  endConversation: () => Promise<void>;
  toggleMemory: (index: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentMood: null,
  setMood: (mood) => set({ currentMood: mood }),
  
  conversationId: null,
  
  startConversation: async (moodId: string) => {
    const res = await chatApi.start(moodId);
    set({ conversationId: res.conversationId });
  },

  messages: [],
  addLocalMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  sendMessage: async (text: string) => {
    const { conversationId, addLocalMessage } = get();
    if (!conversationId) return;
    
    // Add user message locally
    addLocalMessage({
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    });

    // Call API
    const res = await chatApi.sendMessage(conversationId, text);
    
    // Add AI reply
    addLocalMessage({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: res.reply, // Handles safe replies as well
      timestamp: new Date().toISOString(),
      riskLevel: res.riskLevel
    });
    return res.reply;
  },

  sendAudio: async (audioBlob: Blob, durationMs: number) => {
    const { conversationId, addLocalMessage } = get();
    if (!conversationId) return;

    // Call API with audio blob
    const res = await chatApi.sendAudio(conversationId, audioBlob, durationMs);
    
    // Add user message locally (from transcript)
    addLocalMessage({
      id: Date.now().toString(),
      role: 'user',
      content: res.transcript,
      timestamp: new Date().toISOString(),
      riskLevel: res.riskLevel
    });

    // Add AI reply
    addLocalMessage({
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: res.reply,
      timestamp: new Date().toISOString(),
      riskLevel: res.riskLevel
    });
    return res.reply;
  },

  clearMessages: () => set({ messages: [] }),

  summary: null,
  memories: [],
  
  endConversation: async () => {
    const { conversationId } = get();
    if (!conversationId) return;

    const res = await chatApi.end(conversationId);
    set({ 
      summary: res.summary, 
      memories: res.memoryCandidates.map((m: any) => ({ ...m, selected: true })) 
    });
  },

  toggleMemory: (index: number) => set((state) => {
    const newMemories = [...state.memories];
    newMemories[index].selected = !newMemories[index].selected;
    return { memories: newMemories };
  }),
}));
