import { rem, TextInput, ActionIcon } from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { theme } from "../../../theme";
import { useTheme } from "../../../components/ThemeContext";
import { useState } from "react";
const iconSize = rem(50);

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput = ({ sendMessage }: MessageInputProps) => {
  const { isMobile } = useTheme();
  const [message, setMessage] = useState("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(message);
    setMessage("");
  };
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: rem(10),
        width: "100%",
        padding: rem(10),
        marginTop: isMobile ? rem(10) : 0,
      }}
      onSubmit={handleSubmit}
    >
      <TextInput
        size="lg"
        placeholder="Type your message..."
        withErrorStyles={false}
        rightSectionPointerEvents="none"
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
        style={{
          width: "100%",
        }}
      />
      <ActionIcon
        variant="subtle"
        color={theme.primaryColor}
        type="submit"
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        <IconSend2
          style={{
            width: iconSize,
            height: iconSize,
          }}
        />
      </ActionIcon>
    </form>
  );
};

export default MessageInput;
