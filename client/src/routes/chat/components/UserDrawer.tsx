import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Indicator,
  Paper,
  Text,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useAuth } from "../../../components/AuthContext";
import { useTheme } from "../../../components/ThemeContext";
import { theme } from "../../../theme";
import { socket } from "../../../socket";
import { useEffect, useState } from "react";
import { ConnectedUser } from "../../../lib/types";
import MenuButton from "./MenuButton";
import { useNavigate } from "react-router";

const UserDrawer = () => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<ConnectedUser[]>([]);
  const { isMobile, drawerOpen, setDrawerOpen } = useTheme();
  const clickOutsideref = useClickOutside(
    () => isMobile && setDrawerOpen(false)
  );

  useEffect(() => {
    socket.on("connected-users", (data) => {
      const onlineUsers = data.filter(
        (user: ConnectedUser) => user.status === "online"
      );
      const offlineUsers = data.filter(
        (user: ConnectedUser) => user.status === "offline"
      );
      setConnectedUsers(onlineUsers);
      setOfflineUsers(offlineUsers);
    });

    return () => {
      socket.off("connected-users");
    };
  }, []);

  return (
    <div
      ref={clickOutsideref}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "300px",
        justifyContent: "space-between",
        visibility: !drawerOpen ? "hidden" : "visible",
        zIndex: 100,
      }}
    >
      <Paper
        shadow={isMobile ? "xs" : "sm"}
        style={{
          margin: "6px",
          height: "100%",
          overflow: "auto", 
        }}
        withBorder
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box>
            <Divider
              style={{
                margin: "10px",
              }}
              label="Online"
              labelPosition="left"
            />
            {connectedUsers.map((user) => (
              <UserProfileStatus key={user.userId} user={user} />
            ))}
            <Divider
              style={{
                margin: "10px",
              }}
              label="Offline"
              labelPosition="left"
            />
            {offlineUsers.map((user) => (
              <UserProfileStatus key={user.userId} user={user} />
            ))}
          </Box>
          <CurrentUserProfile />
        </div>
      </Paper>
    </div>
  );
};

export default UserDrawer;

const CurrentUserProfile = () => {
  const { user, userStatus } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      socket.connect().active;
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Card
      style={{
        padding: "10px",
        margin: "10px",
        paddingBottom: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      shadow="lg"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Indicator
          position="bottom-end"
          color={userStatus === "Online" ? "green" : "gray"}
          size={12}
        >
          <Avatar
            size="md"
            radius="xl"
            color={theme.primaryColor}
            src={user?.profileUrl}
            alt={user?.username}
            name={user?.username}
          />
        </Indicator>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
          }}
        >
          <Text size="sm">{user?.username}</Text>
          <Text size="xs">{userStatus}</Text>
        </div>
      </div>

      {userStatus === "Offline" ? (
        <Button
          onClick={() => {
            socket.connect();
          }}
          color={theme.primaryColor}
          style={{ marginLeft: "auto" }}
          size="xs"
          variant="outline"
        >
          Reconnect
        </Button>
      ) : (
        <MenuButton />
      )}
    </Card>
  );
};

const UserProfileStatus = ({ user }: { user: ConnectedUser }) => {
  return (
    <Box
      style={{
        padding: "10px",
        margin: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Indicator
          position="bottom-end"
          color={user.status === "online" ? "green" : "gray"}
          size={12}
        >
          <Avatar
            size="md"
            radius="xl"
            color={theme.primaryColor}
            src={user?.profileUrl}
            alt={user?.username}
            name={user?.username}
          />
        </Indicator>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "2px",
          }}
        >
          <Text
            c={user.status === "online" ? theme.primaryColor : "gray"}
            size="sm"
          >
            {user?.username}
          </Text>
          <Text size="xs" c={user.status === "online" ? "green" : "white"}>
            {user.status === "online" ? "Online" : "Offline"}
          </Text>
        </div>
      </div>
    </Box>
  );
};