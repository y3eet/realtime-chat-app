import { Avatar, Divider, Paper, Text } from "@mantine/core";
import { theme } from "../../../theme";
import { Message } from "../../../lib/types";
import { dateFormatter, isToday } from "../../../lib/tools";
import { useHover } from "@mantine/hooks";

const MessageBox = ({ message }: { message: Message }) => {
  const { hovered, ref: hoverRef } = useHover<HTMLDivElement>();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isToday(message.createdAt) && (
        <Divider
          style={{
            margin: "10px",
          }}
          label={dateFormatter(message.createdAt)}
          labelPosition="left"
        />
      )}

      <Paper
        ref={hoverRef as any}
        color={theme.primaryColor}
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "10px",
        }}
        withBorder={hovered}
        p="md"
      >
        <Avatar
          size="md"
          name={message.user.username}
          src={message.user.profileUrl}
          alt={message.user.username}
          radius="xl"
          style={{ marginRight: "10px", marginTop: "10px" }}
        />
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Text size="lg" style={{ color: theme.primaryColor }}>
              {message.user.username}
            </Text>
            <Text size="xs">{dateFormatter(message.createdAt)}</Text>
          </div>
          <Text size="md">{message.message}</Text>
        </div>
      </Paper>
    </div>
  );
};

export default MessageBox;
