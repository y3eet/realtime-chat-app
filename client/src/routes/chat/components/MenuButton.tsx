import { Menu, rem } from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useAuth } from "../../../components/AuthContext";

const MenuButton = () => {
  const { logout } = useAuth();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <IconDotsVertical
          style={{
            width: rem(20),
            height: rem(20),
            cursor: "pointer",
          }}
          size={20}
          stroke={2}
        />
      </Menu.Target>

      <Menu.Dropdown>
        {/* <Menu.Label>Settingh</Menu.Label> */}
        <Menu.Item
          disabled
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Settings
        </Menu.Item>

        {/* <Menu.Label>Danger zone</Menu.Label> */}

        <Menu.Item
          color="red"
          onClick={logout}
          leftSection={
            <IconLogout style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuButton;
