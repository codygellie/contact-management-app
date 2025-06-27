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
    // Use the correct socket server URL (should match your backend server)
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    console.log('🔌 Connecting to socket server:', socketUrl);
    
    const socketInstance = io(socketUrl, {
      // Add these options for better connection reliability
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server:', socketInstance.id);
      toast.success('Connected to real-time updates');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('❌ Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', error);
      toast.error('Failed to connect to real-time updates');
    });

    // Listen for the CORRECT event names (matching your backend)
    socketInstance.on('contactCreated', (contact) => {
      console.log('📝 Contact created via socket:', contact);
      queryClient.invalidateQueries(['contacts']);
      toast.success(`${contact.name} was added by another user`);
    });

    socketInstance.on('contactUpdated', (contact) => {
      console.log('✏️ Contact updated via socket:', contact);
      queryClient.invalidateQueries(['contacts']);
      toast.success(`${contact.name} was updated by another user`);
    });

    socketInstance.on('contactDeleted', (data) => {
      console.log(' Contact deleted via socket:', data);
      queryClient.invalidateQueries(['contacts']);
      toast.success('A contact was deleted by another user');
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