import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./components/AuthContext.tsx";
import { ThemeProvider } from "./components/ThemeContext.tsx";
import { SocketProvider } from "./components/SocketContext.tsx";
import Login from "./routes/login/Login.tsx";
import Register from "./routes/register/Register.tsx";
import ChatRoom from "./routes/chat/ChatRoom.tsx";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="chat" element={<ChatRoom />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
