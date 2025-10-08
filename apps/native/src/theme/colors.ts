export const themes = {
  light: {
    background: "#ffffff",
    text: "#000000",
  },
  dark: {
    background: "#000000",
    text: "#ffffff",
  },
} as const;

export type ThemeNames = keyof typeof themes;
export type ThemeColors = (typeof themes)[keyof typeof themes];
