import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNotification, incrementUnreadCount } from '../store/slices/notificationSlice';

const useWebSocket = (token) => {
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const dispatch = useDispatch();

  const connect = useCallback(() => {
    if (!token) return;

    // Clear any existing reconnection timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    // Disconnect existing connection
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    // Connect to WebSocket server
    const apiUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    
    socketRef.current = io(apiUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000, // 10 second timeout
      autoConnect: true
    });

    // Listen for new notifications
    socketRef.current.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
      dispatch(addNotification(notification));
      dispatch(incrementUnreadCount());
    });

    // Handle connection
    socketRef.current.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      setIsConnected(true);
      setConnectionAttempts(0);
      socketRef.current.emit('authenticate', token);
    });

    // Handle disconnect
    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket server:', reason);
      setIsConnected(false);
      
      // Attempt reconnection for certain reasons
      if (reason === 'io server disconnect' || reason === 'ping timeout') {
        // Server actively disconnected us, don't reconnect automatically
        console.log('Server initiated disconnect, manual reconnection required');
      } else if (connectionAttempts < 3) {
        // Auto-reconnect with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000);
        console.log(`Attempting reconnection in ${delay}ms (attempt ${connectionAttempts + 1})`);
        reconnectTimerRef.current = setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          connect();
        }, delay);
      }
    });

    // Handle connection error
    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setIsConnected(false);
      
      // Don't attempt immediate reconnection on error
      if (connectionAttempts < 3) {
        const delay = Math.min(2000 * Math.pow(2, connectionAttempts), 15000);
        console.log(`Retrying connection in ${delay}ms due to error`);
        reconnectTimerRef.current = setTimeout(() => {
          setConnectionAttempts(prev => prev + 1);
          connect();
        }, delay);
      }
    });

    // Handle authentication result
    socketRef.current.on('authenticated', (result) => {
      console.log('Authentication result:', result);
    });

    socketRef.current.on('unauthorized', (error) => {
      console.error('WebSocket authentication failed:', error);
      disconnect();
    });

  }, [token, dispatch, connectionAttempts]);

  const disconnect = useCallback(() => {
    // Clear reconnection timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionAttempts(0);
  }, []);

  const manualReconnect = useCallback(() => {
    console.log('Manual reconnection requested');
    setConnectionAttempts(0);
    connect();
  }, [connect]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Handle token changes
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return { 
    socket: socketRef.current, 
    isConnected, 
    connectionAttempts,
    connect: manualReconnect, 
    disconnect 
  };
};

export default useWebSocket;