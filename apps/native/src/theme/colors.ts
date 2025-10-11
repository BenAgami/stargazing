export const themes = {
  light: {
    background: "#F2F2F7",
    text: "#000000",
    surface: "#FFFFFF",
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    surface: "#767577",
  },
} as const;

export type ThemeNames = keyof typeof themes;
export type ThemeColors = (typeof themes)[keyof typeof themes];
