import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { MantineProvider } from "@mantine/core";
import { createTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface ThemeContextType {
  toggleColorScheme: () => void;
  colorScheme: "dark" | "light";
  setThemeColor: (theme: string) => void;
  setDrawerOpen: (open: boolean) => void;
  drawerOpen: boolean;
  isMobile: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery("(max-width: 800px)") || false;
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");
  const [themeColor, setThemeColor] = useState<string>("violet");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleColorScheme = () => {
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const theme = createTheme({
    primaryColor: themeColor,
  });

  return (
    <ThemeContext.Provider
      value={{
        toggleColorScheme,
        colorScheme,
        setThemeColor,
        setDrawerOpen,
        drawerOpen,
        isMobile,
      }}
    >
      <div>
        <MantineProvider forceColorScheme={colorScheme ?? "auto"} theme={theme}>
          {children}
        </MantineProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
