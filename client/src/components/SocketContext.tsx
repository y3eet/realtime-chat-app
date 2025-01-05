import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "../../url";

interface SocketContextType {
  isConnected: boolean;
  socket: Socket | undefined;
  listen: (event: string, callback: (...args: any[]) => void) => () => void;
  connect: () => void;
  disconnect: () => void;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>(
    io(SERVER_URL, { withCredentials: true })
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SERVER_URL, { withCredentials: true });

    // Listen for connection events
    socketInstance.on("connect", () => {
      console.log("Connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setIsConnected(false);
    });

    // Set the socket instance in state
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
    };
  }, []);

  // Helper function to listen to specific events

  const listen = (event: string, callback: any) => {
    if (!socket) {
      console.warn("Socket is not initialized yet.");
      return () => {};
    }
    console.log("Listening to event:", event);
    socket.on(event, callback);

    // Return a cleanup function to remove the listener
    return () => {
      socket.off(event, callback);
    };
  };

  const connect = () => {
    if (socket) {
      socket.connect();
    } else {
      console.warn("Socket is not initialized yet.");
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    } else {
      console.warn("Socket is not initialized yet.");
    }
  };
  return (
    <SocketContext.Provider
      value={{ socket, isConnected, listen, connect, disconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
