import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details?: string;
  category: 'navigation' | 'order' | 'time' | 'upload' | 'system' | 'alert' | 'other';
}

interface ActivityLogContextType {
  logs: ActivityLogEntry[];
  addLog: (action: string, details?: string, category?: ActivityLogEntry['category']) => void;
  clearLogs: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

  const addLog = useCallback((
    action: string,
    details?: string,
    category: ActivityLogEntry['category'] = 'other'
  ) => {
    const entry: ActivityLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      details,
      category,
    };

    setLogs(prev => [entry, ...prev].slice(0, 1000)); // Keep last 1000 entries
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <ActivityLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error('useActivityLog must be used within ActivityLogProvider');
  }
  return context;
}