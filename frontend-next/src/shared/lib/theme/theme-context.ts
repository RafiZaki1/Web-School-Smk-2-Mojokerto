"use client";

import { createContext } from "react";
import type { ColorTheme, ThemePreference } from "./theme";

export interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  setPreference: () => undefined,
  colorTheme: "ocean",
  setColorTheme: () => undefined,
});
