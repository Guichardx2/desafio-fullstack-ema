import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebsocket = <T = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback(() => {
    const socket = io(`${import.meta.env.VITE_NEST_WEBSOCKET_URL}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ Conectado ao WebSocket');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.warn('⚠️ Desconectado do WebSocket');
    });

    socket.on('events', (incomingData: T) => {
      console.log('📥 Dados recebidos do WebSocket:', incomingData);
      setData(incomingData);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erro ao conectar ao WebSocket:', err.message);
    });

    socketRef.current = socket;
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [connectSocket]);

  return {
    data,
    connected,
  };
};