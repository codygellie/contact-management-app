import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSocketUrl = () => {
      const currentHost = window.location.hostname;
      const backendPort = 4001;
      const url = `http://${currentHost}:${backendPort}`;
      return url;
    };
    
    const socketUrl = getSocketUrl();
    console.log('Connecting to socket server:', socketUrl);
    console.log('Current hostname for socket:', window.location.hostname);
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server:', socketInstance.id);
      toast.success('Connected to real-time updates');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error(' Socket connection error:', error);
      toast.error('Failed to connect to real-time updates');
    });

    // Listen for the CORRECT event names (matching your backend)
    socketInstance.on('contactCreated', (contact) => {
      console.log('Contact created via socket:', contact);
      queryClient.invalidateQueries(['contacts']);
      toast.success(`${contact.name} was added`);
    });

    socketInstance.on('contactUpdated', (contact) => {
      console.log(' Contact updated via socket:', contact);
      queryClient.invalidateQueries(['contacts']);
      toast.success(`${contact.name} was updated`);
    });

    socketInstance.on('contactDeleted', (data) => {
      console.log(' Contact deleted via socket:', data);
      queryClient.invalidateQueries(['contacts']);
      toast.success('A contact was deleted');
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};