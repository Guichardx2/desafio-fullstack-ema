import { createContext, useContext, type ReactNode } from 'react';
import { useWebsocket } from '../hooks/useWebsocket';
import { EventBackend } from '@/types';

interface WebSocketContextType {
  webSocketEvents: EventBackend | null;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: webSocketEvents, connected } = useWebsocket<EventBackend>();

  return (
    <WebSocketContext.Provider value={{ webSocketEvents, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext deve ser usado dentro de um WebSocketProvider');
  }
  return context;
};