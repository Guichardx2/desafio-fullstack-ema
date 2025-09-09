import { createContext, useContext, type ReactNode, useMemo } from 'react';
import { useWebsocket } from '../hooks/useWebsocket';
import { EventBackend } from '@/types/props/calendar-page/EventBackendProps';

interface WebSocketContextType {
  webSocketEvents: EventBackend[] | null;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: webSocketEvents, connected } = useWebsocket<EventBackend[]>();

  const value = useMemo(() => ({ webSocketEvents, connected }), [webSocketEvents, connected]);

  return (
    <WebSocketContext.Provider value={value}>
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