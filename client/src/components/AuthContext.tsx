import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { UserPayload } from "../lib/types";
import { SERVER_URL } from "../../url";
import { socket } from "../socket";

interface AuthContextType {
  user: UserPayload | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  userStatus: string;
  setUserStatus: (status: string) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userStatus, setUserStatus] = useState<string>("Offline");
  let navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      navigate("/login");
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("User status:", userStatus);
  }, [userStatus]);

  // useEffect(() => {
  //   // Attach socket event listeners
  //   const handleConnect = () => {
  //     console.log("Connected with socket ID:", socket.id);
  //     setIsConnected(true);
  //     console.log("Socket connection status:", socket.connected);
  //   };

  //   const handleDisconnect = () => {
  //     console.log("Disconnected from server");
  //     setIsConnected(false);
  //   };

  //   const handleConnectError = (err: any) => {
  //     console.error("Connection error:", err);
  //   };

  //   socket.on("connect", handleConnect);
  //   socket.on("disconnect", handleDisconnect);
  //   socket.on("connect_error", handleConnectError);

  //   // Cleanup listeners on unmount
  //   return () => {
  //     socket.off("connect", handleConnect);
  //     socket.off("disconnect", handleDisconnect);
  //     socket.off("connect_error", handleConnectError);
  //   };
  // }, []);

  const login = async () => {
    fetchUser();
  };

  // Function to sign out
  const logout = () => {
    fetch(`${SERVER_URL}/api/auth/logout`, {
      credentials: "include",
    }).then(() => {
      socket.disconnect();
      setUser(null);
      navigate("/login");
    });
  };

  // Function to reconnect

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, userStatus, setUserStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
