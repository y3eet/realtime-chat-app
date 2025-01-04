import { ActionIcon } from "@mantine/core";
import { theme } from "../../../theme";
import { useTheme } from "../../../components/ThemeContext";
import {
  IconMenu2,
  IconSun,
  IconMoon,
  IconBrandGithub,
} from "@tabler/icons-react";

const iconSize = "30px";
const ActionButtons = () => {
  const { isMobile } = useTheme();
  const { setDrawerOpen, toggleColorScheme, colorScheme } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        justifyContent: "space-between",
      }}
    >
      <div>
        {isMobile && (
          <ActionIcon
            style={{
              width: iconSize,
              height: iconSize,
            }}
            variant="subtle"
            color={theme.primaryColor}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <IconMenu2
              style={{
                width: iconSize,
                height: iconSize,
              }}
            />
          </ActionIcon>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <ActionIcon
          style={{
            width: iconSize,
            height: iconSize,
          }}
          variant="subtle"
          color="white"
          onClick={() => {
            window.open("https://github.com/y3eet", "_blank");
          }}
        >
          <IconBrandGithub
            style={{
              width: iconSize,
              height: iconSize,
            }}
          />
        </ActionIcon>
        <ActionIcon
          c={colorScheme === "dark" ? "yellow" : "blue"}
          style={{
            width: iconSize,
            height: iconSize,
          }}
          variant="subtle"
          onClick={toggleColorScheme}
        >
          {colorScheme === "dark" ? (
            <IconSun
              style={{
                width: iconSize,
                height: iconSize,
              }}
            />
          ) : (
            <IconMoon
              style={{
                width: iconSize,
                height: iconSize,
              }}
            />
          )}
        </ActionIcon>
      </div>
    </div>
  );
};

export default ActionButtons;
