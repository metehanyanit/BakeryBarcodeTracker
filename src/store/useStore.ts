import { create } from 'zustand';
import { DndEntity } from '../types/dnd';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'progress';
  data?: any;
}

interface Store {
  data: DndEntity[];
  isProcessing: boolean;
  shouldStop: boolean;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  processingLogs: LogEntry[];
  processedCount: number;
  setData: (data: DndEntity[]) => void;
  setProcessing: (status: boolean) => void;
  setShouldStop: (status: boolean) => void;
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
  addProcessingLog: (message: string, type: LogEntry['type'], data?: any) => void;
  clearProcessingLogs: () => void;
  setProcessedCount: (count: number) => void;
  resetProcessing: () => void;
}

export const useStore = create<Store>((set) => ({
  data: [],
  isProcessing: false,
  shouldStop: false,
  chatHistory: [],
  processingLogs: [],
  processedCount: 0,
  setData: (data) => set({ data }),
  setProcessing: (status) => set({ isProcessing: status }),
  setShouldStop: (status) => set({ shouldStop: status }),
  addChatMessage: (role, content) => 
    set((state) => ({
      chatHistory: [...state.chatHistory, { role, content }]
    })),
  clearChat: () => set({ chatHistory: [] }),
  addProcessingLog: (message, type, data) =>
    set((state) => ({
      processingLogs: [...state.processingLogs, {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
        data
      }]
    })),
  clearProcessingLogs: () => set({ processingLogs: [] }),
  setProcessedCount: (count) => set({ processedCount: count }),
  resetProcessing: () => set({ 
    isProcessing: false, 
    shouldStop: false, 
    processedCount: 0,
    processingLogs: []
  })
}));