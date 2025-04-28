export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    border: '#e1e1e1',
    card: '#f8f8f8',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    border: '#333',
    card: '#181818',
  },
};

export type ColorScheme = keyof typeof Colors;