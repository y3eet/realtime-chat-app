import { Box, Card, Divider, Paper } from "@mantine/core";
import { useTheme } from "../../components/ThemeContext";
import { useEffect, useRef, useState } from "react";
import UserDrawer from "./components/UserDrawer";
import MessageInput from "./components/MessageInput";
import MessageBox from "./components/MessageBox";
import { Message } from "../../lib/types";
import { dateFormatter } from "../../lib/tools";
import { SERVER_URL } from "../../../url";
import ActionButtons from "./components/ActionButtons";
import { useSocket } from "../../components/SocketContext";

const ChatRoom = () => {
  const { listen, socket } = useSocket();
  const { isMobile } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/chat/messages`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const cleanup = listen("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    return cleanup;
  }, []);

  return (
    <>
      <UserDrawer />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <Paper
          withBorder
          style={{
            width: isMobile ? "98vw" : "calc(100vw - 320px)",
            height: "100vh",
            margin: "5px",
            marginLeft: isMobile ? "5px" : "310px",
            justifyContent: "space-between",
          }}
        >
          <Card pb={8}>
            <ActionButtons />
          </Card>
          <Box
            p={isMobile ? "xs" : "md"}
            style={{
              height: "calc(100vh - 170px)",
              overflow: "auto",
              marginBottom: "10px",
            }}
          >
            <Divider
              style={{
                margin: "10px",
              }}
              label={dateFormatter(messages[0]?.createdAt)}
              labelPosition="left"
            />

            {messages.map((message, index) => (
              <MessageBox key={index} message={message} />
            ))}

            <div ref={scrollRef}></div>
          </Box>

          <MessageInput
            sendMessage={(e) => {
              socket?.emit("send-message", { text: e });
            }}
          />
        </Paper>
      </div>
    </>
  );
};

export default ChatRoom;
