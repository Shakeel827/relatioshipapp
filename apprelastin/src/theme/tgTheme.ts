import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "@relastin_theme_mode";

export type TgTheme = {
  mode: Exclude<ThemeMode, "system">;
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    text: string;
    text2: string;
    divider: string;
    accent: string;
    accent2: string;
    bubbleMe: string;
    bubbleOther: string;
    bubbleText: string;
    bubbleText2: string;
    danger: string;
    chip: string;
  };
  radii: {
    xl: number;
    lg: number;
    md: number;
    sm: number;
  };
};

function buildTheme(mode: "light" | "dark"): TgTheme {
  if (mode === "dark") {
    return {
      mode,
      colors: {
        bg: "#0e1621",
        surface: "#17212b",
        surface2: "#1f2b38",
        text: "#e6edf3",
        text2: "#9aa4af",
        divider: "rgba(255,255,255,0.10)",
        accent: "#2ea6ff",
        accent2: "#7cc7ff",
        bubbleMe: "#2b5278",
        bubbleOther: "#182533",
        bubbleText: "#e6edf3",
        bubbleText2: "rgba(230,237,243,0.65)",
        danger: "#ff5b5b",
        chip: "#243447",
      },
      radii: { xl: 22, lg: 18, md: 14, sm: 10 },
    };
  }

  return {
    mode,
    colors: {
      bg: "#eef3f9",
      surface: "#ffffff",
      surface2: "#f5f7fb",
      text: "#0b1220",
      text2: "#667085",
      divider: "rgba(16,24,40,0.10)",
      accent: "#3390ec",
      accent2: "#6ab8ff",
      bubbleMe: "#d7f0ff",
      bubbleOther: "#ffffff",
      bubbleText: "#0b1220",
      bubbleText2: "rgba(11,18,32,0.55)",
      danger: "#ef4444",
      chip: "#e8f2ff",
    },
    radii: { xl: 22, lg: 18, md: 14, sm: 10 },
  };
}

type Ctx = {
  theme: TgTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export function TgThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === "system" || stored === "light" || stored === "dark") setModeState(stored);
    })();
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  };

  const resolved: "light" | "dark" = mode === "system" ? (system === "dark" ? "dark" : "light") : mode;
  const theme = useMemo(() => buildTheme(resolved), [resolved]);

  const value = useMemo(() => ({ theme, mode, setMode }), [theme, mode]);
  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTgTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTgTheme must be used within TgThemeProvider");
  return ctx;
}
