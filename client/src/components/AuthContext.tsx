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
import { useSocket } from "./SocketContext";

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
  const { connect, disconnect, isConnected } = useSocket();
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
    fetchUser().then(connect).catch(console.error);
  }, []);

  useEffect(() => {
    setUserStatus(isConnected ? "Online" : "Offline");
  }, [isConnected]);

  const login = async () => {
    fetchUser().then(connect).catch(console.error);
  };

  // Function to sign out
  const logout = () => {
    fetch(`${SERVER_URL}/api/auth/logout`, {
      credentials: "include",
    }).then(() => {
      disconnect();
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
